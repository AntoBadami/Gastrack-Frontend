import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/Login.vue'
import Home from '@/pages/Home.vue'
import Ordenes from '@/pages/Ordenes.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/ordenes',
    name: 'Ordenes',
    component: Ordenes
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
