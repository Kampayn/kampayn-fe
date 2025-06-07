import type { Campaign } from "./campaign"

export interface Application {
  id: string
  campaign_id: string
  influencer_id: string
  status: 'applied' | 'rejected' | 'accepted'
  applied_at: string
  createdAt: string
  updatedAt: string
  campaign: Campaign
}

// export interface ApplicationParams {
//   campaign_id: string
// }

export interface ApplicationResponse {
  message: string
}
