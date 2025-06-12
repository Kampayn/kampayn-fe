import { createRouter, createWebHistory } from 'vue-router'

import { useUserStore } from '@/stores/user'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import CreateCampaignView from '@/views/CreateCampaignView.vue'
import InfluencerRecommendation from '@/views/InfluencerRecommendation.vue'
import TaskListInfluencer from '@/views/TaskListInfluencerView.vue'
import EditCampaignView from '@/views/EditCampaignView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/verify-email',
      name: 'verify-email',
      component: () => import('../views/VerifyEmail.vue'),
    },
    {
      path: '/choose-account-type',
      name: 'choose-account-type',
      component: () => import('../views/ChooseAccountTypeView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/brand-register',
      name: 'brand-register',
      component: () => import('../views/BrandRegisterView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/influencer-register',
      name: 'influencer-register',
      component: () => import('../views/InfluencerRegisterView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/create',
      name: 'create',
      component: CreateCampaignView,
      meta: { requiresAuth: true },
    },
    {
      path: '/influencer-recommendation',
      name: 'influencer-recommendation',
      component: InfluencerRecommendation,
      meta: { requiresAuth: true },
    },
    {
      path: '/:id',
      name: 'detail',
      component: () => import('../views/DetailCampaignView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/task-list-influencer',
      name: 'task-list-influencer',
      component: TaskListInfluencer,
      meta: { requiresAuth: true },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/campaign/edit/:id',
      name: 'edit-campaign',
      component: EditCampaignView,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile/:id',
      name: 'profile-other',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('../views/ChatView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// Navigation guard to check authentication for protected routes
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !userStore.isLoggedIn) {
    // Redirect to login page with the intended destination as a query parameter
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
