export interface InfluencerCard {
  username: string
  followers: number
  engagement_rate: number
  tier: string
  categories: string[]
  is_verified: boolean
}

export interface GetRecommendationParams {
  tier: 'Mikro' | 'Makro' | 'Nano'
  business_information:
    | 'Food'
    | 'Fashion'
    | 'Beauty'
    | 'Lifestyle'
    | 'Other'
  top_n: number
  sort_by: 'Engagement%20Rate'
}

export interface Influencer {
  Category: string;
  'Engagement Rate': number;
  Followers: number;
  Tier: string;
  Username: string;
}

export interface Recommendations {
  category: string;
  count: number;
  recommendations: Influencer[];
  tier: string;
}

export interface GetRecommendationResponse {
  business_information: string;
  count: number;
  recommendations: Recommendations;
  sort_by: string;
  tier: string;
}