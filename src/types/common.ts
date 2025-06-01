/**
 * Generic Result type for handling success and error cases
 * T represents the success data type
 * E represents the error type, defaults to string
 */
export type Result<T, E = string> = { success: true; data: T } | { success: false; error: E }

export interface ApiError {
  message: string
  statusCode?: number
}
