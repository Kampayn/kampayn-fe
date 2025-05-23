import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import VerifyEmail from '@/views/VerifyEmail.vue'
import DashboardView from '@/views/DashboardView.vue'

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
      component: VerifyEmail,
    },
    {
      path: '/choose-account-type',
      name: 'choose-account-type',
      component: () => import('../views/ChooseAccountTypeView.vue'),
    },
    {
      path: '/brand-register',
      name: 'brand-register',
      component: () => import('../views/BrandRegisterView.vue'),
    },
    {
      path: '/influencer-register',
      name: 'influencer-register',
      component: () => import('../views/InfluencerRegisterView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/create-campaign',
      name: 'create-campaign',
      component: () => import('../views/CreateCampaignView.vue'),
    },
    {
      path: '/campaign/:id',
      name: 'detail-campaign',
      component: () => import('../views/DetailCampaignView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
