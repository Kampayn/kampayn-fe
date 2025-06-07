export const getCampaignTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    brand_awareness: 'Brand Awareness',
    product_launch: 'Product Launch',
    product_promotion: 'Product Promotion',
    promo_sale: 'Promo & Sale',
  }
  return types[type] || type
}

export const getPlatformIcon = (platform: string) => {
  const icons: Record<string, string> = {
    instagram: '📷',
    tiktok: '🎵',
    youtube: '📺',
  }
  return icons[platform] || '📱'
}

export const getPaymentMethodLabel = (method: string) => {
  const methods: Record<string, string> = {
    bank_transfer: 'Bank Transfer',
    secure_payment: 'Secure Payment',
  }
  return methods[method] || method
}
