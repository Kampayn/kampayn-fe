export interface User {
  id: string
  name: string
  email: string
  role?: 'influencer' | 'brand'
  email_verified_at?: string
  brandProfile?: BrandProfile
  influencerProfile?: InfluencerProfile
}

export interface BrandProfile {
  id: number
  user_id: number
  company: string
  photo_url?: string
  category: string
}

export interface InfluencerProfile {
  id: number
  user_id: number
  instagram_username: string
  photo_url?: string
  categories: string[]
  follower_tier: 'nano' | 'micro' | 'macro' | 'mega'
  portfolio_url?: string
  instagram_followers?: string
  instagram_avg_likes?: string
  instagram_avg_comments?: string
  instagram_engagement_rate?: string
}
