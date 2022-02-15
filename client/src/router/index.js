import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/components/LandingPage'
import Whitelist from '@/components/Whitelist'
import Dashboard from '@/components/Dashboard'

const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage
  },
  {
    path: '/whitelist',
    name: 'Whitelist',
    component: Whitelist
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
