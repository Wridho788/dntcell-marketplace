# Setup Environment Variables

## Langkah-langkah Setup

### 1. Copy .env.example ke .env.local
```bash
cp .env.example .env.local
```

### 2. Isi Konfigurasi Supabase

Buka `.env.local` dan isi dengan konfigurasi Supabase Anda:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Cara mendapatkan Supabase credentials:**
1. Buka [Supabase Dashboard](https://app.supabase.com/)
2. Pilih project Anda
3. Klik "Settings" > "API"
4. Copy nilai:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Project API keys → anon/public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. (Opsional) Setup OneSignal untuk Push Notifications

```env
NEXT_PUBLIC_ONESIGNAL_APP_ID=your-onesignal-app-id
```

**Cara mendapatkan OneSignal App ID:**
1. Buka [OneSignal Dashboard](https://onesignal.com/)
2. Pilih app Anda
3. Klik "Settings" > "Keys & IDs"
4. Copy "OneSignal App ID"

### 4. Restart Development Server

```bash
pnpm dev
```

## Verifikasi Setup

Setelah restart, buka browser console dan pastikan Anda melihat:
```
✅ Axios Client configured with Supabase REST API: https://your-project.supabase.co/rest/v1
```

Jika Anda melihat warning:
```
⚠️ Supabase configuration is missing...
```

Maka environment variables belum di-set dengan benar.

## Troubleshooting

### Products tidak muncul di home page
1. Cek browser console untuk error messages
2. Pastikan Supabase URL dan ANON KEY sudah benar
3. Pastikan table `products` ada di Supabase dan memiliki data
4. Pastikan RLS (Row Level Security) policy mengizinkan public read access

### Environment variables tidak terbaca
1. Pastikan file bernama `.env.local` (bukan `.env` saja)
2. Restart development server setelah mengubah environment variables
3. Clear browser cache dan reload

## Database Requirements

Pastikan Supabase database Anda memiliki table dengan struktur:

```sql
-- Table: products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES auth.users(id),
  category_id UUID REFERENCES categories(id),
  name TEXT NOT NULL,
  description TEXT,
  condition TEXT CHECK (condition IN ('new', 'like-new', 'good', 'fair')),
  base_price DECIMAL(10,2) NOT NULL,
  selling_price DECIMAL(10,2) NOT NULL,
  negotiable BOOLEAN DEFAULT true,
  status TEXT CHECK (status IN ('available', 'unavailable', 'sold')),
  details JSONB,
  main_image_url TEXT,
  stock INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable public read access
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view available products"
  ON products FOR SELECT
  USING (status = 'available' AND is_active = true);
```
