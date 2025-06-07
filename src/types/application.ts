import type { Campaign } from "./campaign"
import type { User } from "./user"

export interface Application {
  id: string
  campaign_id: string
  influencer_id: string
  status: 'applied' | 'rejected' | 'accepted'
  applied_at: string
  createdAt: string
  updatedAt: string
  campaign?: Campaign
  influencer?: User
}

// export interface ApplicationParams {
//   campaign_id: string
// }

export interface CreateApplicationResponse {
  message: string
}

export interface GetApplicationResponse {
  message: string
  data: {
    application: Application[]
  }
}

export interface DeleteApplicationResponse {
  message: string
}