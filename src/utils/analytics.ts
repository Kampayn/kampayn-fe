import { analytics } from '@/lib/firebase'
import { logEvent } from 'firebase/analytics'

/**
 * Log a page view event to Firebase Analytics
 * @param page_title - The title of the page
 * @param page_path - The path of the page
 */
export const logPageView = (page_title: string, page_path: string) => {
  logEvent(analytics, 'page_view', {
    page_title,
    page_path,
  })
}