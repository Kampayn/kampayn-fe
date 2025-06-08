export interface Task {
  id: string
  campaign_id?: string
  influencer_id?: string
  submission_url: string
  status: 'pending' | 'approved' | 'rejected'
  submitted_at: string
  createdAt?: string
  updatedAt?: string
}

// interface GetTaskResponse {}
