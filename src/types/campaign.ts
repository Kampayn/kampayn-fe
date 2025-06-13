import type { Application } from "./application"
import type { Task } from "./task"

interface BrandProfile {
  id: string
  user_id: string
  company: string
  photo_url: string | null
  category: string
  createdAt: string // Or Date if you plan to parse it
  updatedAt: string // Or Date if you plan to parse it
}

interface BrandUser {
  id: string
  name: string
  email: string
  brandProfile: BrandProfile
}

export interface Campaign {
  id: string
  user_id: string
  campaign_name: string
  campaign_type: 'brand_awareness' | 'product_launch' | 'promo_sale' | 'other'
  product_story: string
  key_message: string
  content_dos: string[]
  content_donts: string[]
  platforms: string[]
  influencer_tiers: string[]
  content_types: string[]
  influencers_needed: number
  budget: string // Or number if you plan to parse it
  currency: string
  payment_method: 'secure_payment' | 'bank_transfer'
  start_date: string // Or Date
  end_date: string // Or Date
  status: 'draft' | 'published' | 'pending_review' | 'active' | 'completed' | 'cancelled'
  createdAt: string // Or Date
  updatedAt: string // Or Date
  brandUser?: BrandUser
  my_task: Task
  my_application: Application
}

interface Pagination {
  current_page: number
  total_pages: number
  total_items: number
  items_per_page: number
  has_next: boolean
  has_prev: boolean
}

interface Filters {
  sort_by: string
  sort_order: string
}

export interface GetParams {
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'DESC' | 'ASC'
  status?: 'draft' | 'published' | 'pending_review' | 'active' | 'completed' | 'cancelled'
}

export interface GetResponse {
  status: string
  message: string
  data: {
    campaigns: Campaign[]
    pagination: Pagination
    filters: Filters
  }
}

export interface GetCampaignApplicationsResponse {
  status: string
  message: string
  data: {
    application: Application[]
    pagination: Pagination
  }
}

export interface GetCampaignTasksResponse {
  status: string
  message: string
  data: {
    task: Task[]
    pagination: Pagination
  }
}

export interface CreateParams {
  campaign_name: string
  campaign_type: 'brand_awareness' | 'product_launch' | 'promo_sale' | 'other'
  product_story: string
  key_message: string
  content_dos: string[]
  content_donts: string[]
  platforms: string[]
  influencer_tiers: string[]
  content_types: string[]
  influencers_needed: number
  budget: number
  currency?: string
  payment_method: 'secure_payment' | 'bank_transfer'
  start_date: string // Or Date
  end_date: string // Or Date
  status: 'draft' | 'published' | 'pending_review' | 'active' | 'completed' | 'cancelled'
}

export interface CreateResponse {
  status: string
  message: string
  data: {
    campaigns: Campaign[]
  }
}

export interface CampaignResponse {
  status: string
  message: string
  data: {
    campaign: Campaign
  }
}

export interface UpdateParams {
  campaign_name?: string
  campaign_type?: 'brand_awareness' | 'product_launch' | 'promo_sale' | 'other'
  product_story?: string
  key_message?: string
  content_dos?: string[]
  content_donts?: string[]
  platforms?: string[]
  influencer_tiers?: string[]
  content_types?: string[]
  influencers_needed?: number
  budget?: number
  currency?: string
  payment_method?: 'secure_payment' | 'bank_transfer'
  start_date?: string // Or Date
  end_date?: string // Or Date
  status?: 'draft' | 'published' | 'pending_review' | 'active' | 'completed' | 'cancelled'
}
