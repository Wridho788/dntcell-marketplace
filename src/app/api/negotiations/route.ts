import { NextRequest, NextResponse } from "next/server";
import { requireAuth, supabaseAdmin } from "@/lib/api/auth-helpers";

/**
 * Create new negotiation
 * POST /api/negotiations
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Verify authentication and get user
    const user = await requireAuth(request);

    // 2. Parse request body
    const body = await request.json();
    const { product_id, offer_price, note } = body;

    // 3. Validate required fields
    if (!product_id || !offer_price) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          message: "product_id dan offer_price harus diisi",
        },
        { status: 400 }
      );
    }

    // 4. Validate offer_price is a number
    if (typeof offer_price !== "number" || offer_price <= 0) {
      return NextResponse.json(
        {
          error: "Invalid offer_price",
          message: "Harga penawaran harus berupa angka yang valid",
        },
        { status: 400 }
      );
    }

    // 5. Check if product exists and is available for negotiation
    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .select(
        "id, selling_price, negotiable, status"
      )
      .eq("id", product_id)
      .single();

    if (productError || !product) {
      console.error("[Negotiations API] Product query error:", productError);
      return NextResponse.json(
        {
          error: "Product not found",
          message: "Produk tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // 6. Check if product is available
    if (product.status !== "available") {
      return NextResponse.json(
        {
          error: "Product unavailable",
          message: "Produk tidak tersedia untuk negosiasi",
        },
        { status: 400 }
      );
    }

    // 7. Check if product is negotiable
    if (!product.negotiable) {
      return NextResponse.json(
        {
          error: "Product not negotiable",
          message: "Produk ini tidak dapat dinegosiasikan",
        },
        { status: 400 }
      );
    }

    // 8. Validate price range (calculate min as 70% of selling price)
    const minPrice = Math.floor(product.selling_price * 0.7);
    const maxPrice = product.selling_price;

    if (offer_price < minPrice || offer_price >= maxPrice) {
      return NextResponse.json(
        {
          error: "Price out of range",
          message: `Harga penawaran harus antara Rp ${minPrice.toLocaleString(
            "id-ID"
          )} - Rp ${(maxPrice - 1).toLocaleString("id-ID")}`,
        },
        { status: 400 }
      );
    }

    // 9. Check if user already has active negotiation for this product
    const { data: existingNego, error: checkError } = await supabaseAdmin
      .from("negotiations")
      .select("id, status")
      .eq("product_id", product_id)
      .eq("user_id", user.id)
      .in("status", ["pending", "approved"])
      .maybeSingle();

    if (checkError) {
      console.error(
        "[Negotiations API] Error checking existing negotiation:",
        checkError
      );
    }

    if (existingNego) {
      return NextResponse.json(
        {
          error: "Negotiation already exists",
          message: "Anda sudah memiliki negosiasi aktif untuk produk ini",
          existing_negotiation_id: existingNego.id,
        },
        { status: 409 }
      );
    }

    // 10. Create negotiation with user_id
    const { data: negotiation, error: insertError } = await supabaseAdmin
      .from("negotiations")
      .insert({
        product_id,
        user_id: user.id,
        offer_price,
        note: note?.trim() || null,
        status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      console.error(
        "[Negotiations API] Error creating negotiation:",
        insertError
      );
      return NextResponse.json(
        {
          error: "Failed to create negotiation",
          message: "Gagal membuat negosiasi. Silakan coba lagi.",
        },
        { status: 500 }
      );
    }

    // 11. Return success
    return NextResponse.json(
      {
        success: true,
        message: "Negosiasi berhasil dibuat",
        data: negotiation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Negotiations API] Error:", error);

    // Handle unauthorized error
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Anda harus login terlebih dahulu",
        },
        { status: 401 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Terjadi kesalahan pada server. Silakan coba lagi.",
      },
      { status: 500 }
    );
  }
}
