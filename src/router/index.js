import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Login from '@/pages/Login.vue'
import OrdenDetalle from '@/pages/OrdenDetalle.vue'
import Ordenes from '@/pages/Ordenes.vue'
import HistoricoAlarmas from '@/pages/HistoricoAlarmas.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/ordenes',
    name: 'Ordenes',
    component: Ordenes,
    meta: { requiresAuth: true },
  },
  {
    path: '/orden/:numeroOrden',
    name: 'OrdenDetalle',
    component: OrdenDetalle,
    meta: { requiresAuth: true },
  },
  {
    path: '/alarmas',
    name: 'Alarmas',
    component: HistoricoAlarmas,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

//proteccion de rutas
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // si no hay token en memoria, cargar desde localStorage
  if (!auth.token) {
    auth.loadFromStorage()
  }

  const requiresAuth = !!to.meta.requiresAuth

  if (!requiresAuth) {
    return true
  }

  if (!auth.token) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }

  const now = Math.floor(Date.now() / 1000)
  if (auth.exp && auth.exp < now) {
    auth.logout()
    return { name: 'Login', query: { redirect: to.fullPath, expired: '1' } }
  }

  return true
})

export default router
