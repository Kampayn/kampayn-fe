import type { User } from "./user"

export interface Task {
  id: string
  campaign_id?: string
  influencer_id?: string
  submission_url: string
  status: 'pending' | 'approved' | 'rejected'
  submitted_at: string
  createdAt?: string
  updatedAt?: string
  influencer?: User
}

export interface CreateTaskParams {
  campaign_id: string
  submission_url: string
}

export interface CreateTaskResponse {
  status: string
  message: string
  data: {
    task: Task
    isNewTask: boolean
  }
}

export interface UpdateTaskParams {
  id: string
  status: 'approved' | 'rejected'
}

export interface UpdateTaskResponse {
  status: string
  message: string
  data: {
    task: Task
  }
}
