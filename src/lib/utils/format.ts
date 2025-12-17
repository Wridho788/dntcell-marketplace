/**
 * Format currency to Indonesian Rupiah
 * Handles edge cases and ensures consistency
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Rp 0'
  }

  // Handle negative numbers
  const isNegative = amount < 0
  const absoluteAmount = Math.abs(amount)

  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(absoluteAmount)

  return isNegative ? `-${formatted}` : formatted
}

/**
 * Format currency in compact form (e.g., 1.5Jt for 1,500,000)
 */
export function formatCurrencyCompact(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Rp 0'
  }

  const absoluteAmount = Math.abs(amount)

  if (absoluteAmount >= 1_000_000_000) {
    return `Rp ${(absoluteAmount / 1_000_000_000).toFixed(1)}M`
  } else if (absoluteAmount >= 1_000_000) {
    return `Rp ${(absoluteAmount / 1_000_000).toFixed(1)}Jt`
  } else if (absoluteAmount >= 1_000) {
    return `Rp ${(absoluteAmount / 1_000).toFixed(0)}Rb`
  }

  return formatCurrency(amount)
}

/**
 * Format price range
 */
export function formatPriceRange(min: number, max: number): string {
  return `${formatCurrency(min)} - ${formatCurrency(max)}`
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(originalPrice: number, sellingPrice: number): number {
  if (originalPrice <= 0 || sellingPrice <= 0) return 0
  if (sellingPrice >= originalPrice) return 0

  return Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
}

/**
 * Format discount percentage
 */
export function formatDiscount(originalPrice: number, sellingPrice: number): string {
  const discount = calculateDiscount(originalPrice, sellingPrice)
  return discount > 0 ? `-${discount}%` : ''
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const target = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Baru saja'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari lalu`
  
  return formatDate(date)
}
