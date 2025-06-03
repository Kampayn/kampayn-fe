export interface ReviewRow {
  id: number
  influencer: string
  preview: string
  status: string
  statusType: 'pending' | 'approved' | 'rejected'
}
