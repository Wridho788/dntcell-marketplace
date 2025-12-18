"use client";

import { MobileHeader } from "@/components/navigation/mobile-header";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { PriceTag } from "@/components/ui/price-tag";
import { ImageGallery } from "@/components/product/image-gallery";
import { NegotiationModal } from "@/components/negotiation/negotiation-modal";
import { useRequireAuth } from "@/lib/hooks/useAuth";
import { useAuthStore } from "@/lib/store/auth";
import { logUserAction } from "@/lib/utils/logger";
import { checkNegotiationEligibility } from "@/services/negotiation.service";
import type { Product } from "@/services/product.service";
import {
  MapPin,
  MessageCircle,
  Share2,
  ShieldCheck,
  Smartphone,
  Info,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  HandshakeIcon,
} from "lucide-react";
import {
  CONDITION_CONFIG,
  isProductAvailable,
  isProductNegotiable,
  getConditionBadge,
  getStatusBadge,
} from "@/lib/utils/product";
import { formatDiscount } from "@/lib/utils/format";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { requireAuth } = useRequireAuth();
  const { user } = useAuthStore();
  const router = useRouter();
  const [showConditionInfo, setShowConditionInfo] = useState(false);
  const [showNegoModal, setShowNegoModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [negoEligibility, setNegoEligibility] = useState<{
    eligible: boolean;
    reason?: string;
    existing_negotiation_id?: string;
  } | null>(null);

  const isAvailable = isProductAvailable(product);
  const canNegotiate = isProductNegotiable(product);
  const isOwnProduct = user?.id === product.seller_id;
  const conditionInfo = CONDITION_CONFIG[product.condition];
  const statusBadge = getStatusBadge(product.status);
  const conditionBadge = getConditionBadge(product.condition);

  // Calculate discount if exists
  const discount =
    product.original_price && product.original_price > product.price
      ? formatDiscount(product.original_price, product.price)
      : null;

  // Check eligibility on mount if user is logged in
  useEffect(() => {
    if (user && !isOwnProduct && canNegotiate) {
      checkNegotiationEligibility(product.id).then(setNegoEligibility);
    }
  }, [user, product.id, isOwnProduct, canNegotiate]);

  // Track page view on mount
  useState(() => {
    logUserAction("product_viewed", {
      product_id: product.id,
      product_name: product.name,
    });
  });

  const handleNegotiate = () => {
    requireAuth(() => {
      if (isOwnProduct) {
        alert("Anda tidak bisa melakukan negosiasi pada produk sendiri");
        return;
      }
      if (!canNegotiate) {
        alert("Produk ini tidak dapat dinegosiasikan");
        return;
      }

      // Check if user already has active negotiation
      if (negoEligibility && !negoEligibility.eligible) {
        if (negoEligibility.existing_negotiation_id) {
          const confirm = window.confirm(
            "Anda sudah memiliki negosiasi aktif untuk produk ini. Lihat negosiasi sekarang?"
          );
          if (confirm) {
            router.push(
              `/negotiations/${negoEligibility.existing_negotiation_id}`
            );
          }
        } else {
          alert(
            negoEligibility.reason ||
              "Anda tidak dapat membuat negosiasi baru saat ini"
          );
        }
        return;
      }

      logUserAction("negotiation_cta_clicked", {
        product_id: product.id,
        product_name: product.name,
        current_price: product.price,
      });

      setShowNegoModal(true);
    });
  };

  const handleBuyNow = () => {
    requireAuth(() => {
      if (isOwnProduct) {
        alert("Anda tidak bisa membeli produk sendiri");
        return;
      }
      if (!isAvailable) {
        alert("Produk tidak tersedia untuk dibeli saat ini");
        return;
      }

      logUserAction("buy_now_cta_clicked", {
        product_id: product.id,
        product_name: product.name,
        price: product.price,
      });

      // Show payment method selection modal
      setShowPaymentModal(true);
    });
  };

  const handleChat = () => {
    requireAuth(() => {
      if (isOwnProduct) {
        alert("Anda tidak bisa chat dengan diri sendiri");
        return;
      }

      logUserAction("chat_seller_clicked", {
        product_id: product.id,
        seller_id: product.seller_id,
      });

      // Redirect to WhatsApp
      const whatsappNumber = "6285362032167"; // Format: country code + number without +
      const message = encodeURIComponent(
        `Halo, saya tertarik dengan produk: ${
          product.name
        } (${product.price.toLocaleString("id-ID")})`
      );
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
    });
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/products/${product.id}`;

    logUserAction("product_shared", { product_id: product.id });

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `${product.name} - Rp ${product.price.toLocaleString("id-ID")}`,
          url: url,
        });
      } catch (error) {
        console.log("Share cancelled:", error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(url);
      alert("Link produk disalin ke clipboard!");
    }
  };

  return (
    <>
      <MobileHeader
        title="Detail Produk"
        showBack
        actions={
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Bagikan produk"
            >
              <Share2 className="w-5 h-5 text-neutral-700" />
            </button>
            <FavoriteButton productId={product.id} size="sm" />
          </div>
        }
      />

      <main className="container-mobile py-6 space-y-6 pb-24">
        {/* Image Gallery */}
        <ImageGallery images={product.images} productName={product.name} />

        {/* Product Info */}
        <article className="space-y-4">
          {/* Price & Title with Sticky Behavior */}
          <header className="sticky top-0 bg-white z-10 -mx-4 px-4 py-3 border-b border-neutral-100">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h1 className="text-xl font-bold text-neutral-900 flex-1 leading-tight">
                {product.name}
              </h1>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-lg shrink-0 ${statusBadge.color}`}
              >
                {statusBadge.label}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <PriceTag
                price={product.price}
                originalPrice={product.original_price}
                size="lg"
              />
              {discount && (
                <span className="px-2 py-1 bg-error-100 text-error-700 text-xs font-bold rounded">
                  {discount} OFF
                </span>
              )}
            </div>

            {/* Stock Warning */}
            {isAvailable && product.stock && product.stock <= 5 && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-warning-700">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Stok terbatas! Tersisa {product.stock} unit</span>
              </div>
            )}
          </header>

          {/* Condition Badge with Info */}
          <div className="flex gap-2 items-center flex-wrap">
            <span
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${conditionBadge.bg} ${conditionBadge.text} flex items-center gap-1.5`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Kondisi: {conditionBadge.label}
            </span>
            <button
              onClick={() => setShowConditionInfo(!showConditionInfo)}
              className="p-1 hover:bg-neutral-100 rounded transition-colors"
              aria-label="Info kondisi"
            >
              <Info className="w-4 h-4 text-neutral-500" />
            </button>
          </div>

          {/* Condition Info Panel */}
          {showConditionInfo && (
            <div className="bg-info-50 border border-info-200 rounded-xl p-4">
              <h3 className="font-semibold text-info-900 mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Tentang Kondisi &ldquo;{conditionInfo.label}&rdquo;
              </h3>
              <p className="text-sm text-info-800 leading-relaxed">
                {conditionInfo.description}
              </p>
            </div>
          )}

          {/* Negotiation Hint */}
          {canNegotiate && product.min_negotiable_price && (
            <div className="bg-success-50 border border-success-200 rounded-xl p-4 flex gap-3">
              <TrendingDown className="w-5 h-5 text-success-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-success-900 mb-1">
                  Bisa Nego!
                </h3>
                <p className="text-sm text-success-800">
                  Penjual menerima penawaran mulai dari{" "}
                  <span className="font-bold">
                    Rp {product.min_negotiable_price.toLocaleString("id-ID")}
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Trust Signals */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-neutral-50 rounded-lg p-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success-600" />
              <span className="text-xs text-neutral-700">100% Original</span>
            </div>
            <div className="bg-neutral-50 rounded-lg p-3 flex items-center gap-2">
              <HandshakeIcon className="w-4 h-4 text-primary-600" />
              <span className="text-xs text-neutral-700">Garansi Toko</span>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <section className="bg-neutral-50 rounded-xl p-4">
              <h2 className="font-semibold text-neutral-900 mb-2">Deskripsi</h2>
              <p className="text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed">
                {product.description}
              </p>
            </section>
          )}

          {/* Specifications */}
          {product.specifications &&
            Object.keys(product.specifications).length > 0 && (
              <section className="bg-neutral-50 rounded-xl p-4">
                <h2 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  Spesifikasi
                </h2>
                <dl className="space-y-2.5">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between text-sm gap-4"
                      >
                        <dt className="text-neutral-600">{key}</dt>
                        <dd className="text-neutral-900 font-medium text-right">
                          {String(value)}
                        </dd>
                      </div>
                    )
                  )}
                </dl>
              </section>
            )}

          {/* Seller Info Placeholder */}
          <section className="bg-white rounded-xl p-4 border border-neutral-200">
            <h2 className="font-semibold text-neutral-900 mb-3">Penjual</h2>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold text-lg">D</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-neutral-900">DNTCell Store</p>
                  <ShieldCheck
                    className="w-4 h-4 text-success-600"
                    aria-label="Verified Seller"
                  />
                </div>
              </div>
            </div>
          </section>
        </article>
        {/* Bottom Action Bar with Smart CTAs */}
        <div className="left-0 right-0 bg-white border-t border-neutral-200 pt-4">
          <div className="container-mobile">
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                className="shrink-0"
                disabled={!isAvailable}
                onClick={handleChat}
                title={
                  !isAvailable ? "Produk tidak tersedia" : "Chat dengan penjual"
                }
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
              {product.negotiable && canNegotiate && (
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  disabled={!isAvailable}
                  onClick={handleNegotiate}
                >
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Nego
                </Button>
              )}

              <Button
              variant={'outline'}
                size="lg"
                className="shrink-0"
                disabled={!isAvailable}
                onClick={handleBuyNow}
              >
                Checkout
              </Button>

            </div>
          </div>
        </div>
        
      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-6 space-y-4 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-neutral-900">
                Pilih Metode Pembayaran
              </h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <div className="space-y-3">
              {/* COD Option */}
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  router.push(
                    `/orders/create?product_id=${product.id}&payment_method=cod`
                  );
                }}
                className="w-full p-4 border-2 border-neutral-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                    <HandshakeIcon className="w-6 h-6 text-success-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">
                      Cash on Delivery (COD)
                    </p>
                    <p className="text-sm text-neutral-600">
                      Bayar saat barang diterima
                    </p>
                  </div>
                </div>
              </button>

              {/* Bank Transfer Option */}
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  router.push(
                    `/orders/create?product_id=${product.id}&payment_method=bank_transfer`
                  );
                }}
                className="w-full p-4 border-2 border-neutral-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🏦</span>
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">
                      Transfer Bank
                    </p>
                    <p className="text-sm text-neutral-600">
                      Transfer ke Bank Mandiri
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
      </main>

      {/* Negotiation Modal */}
      <NegotiationModal
        product={product}
        isOpen={showNegoModal}
        onClose={() => setShowNegoModal(false)}
        onSuccess={() => {
          setShowNegoModal(false);
          // Refresh eligibility
          checkNegotiationEligibility(product.id).then(setNegoEligibility);
        }}
      />

    </>
  );
}
