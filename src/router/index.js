import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Login from '@/pages/Login.vue'
import OrdenDetalle from '@/pages/OrdenDetalle.vue'
import Ordenes from '@/pages/Ordenes.vue'
import HistoricoAlarmas from '@/pages/HistoricoAlarmas.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/ordenes',
    name: 'Ordenes',
    component: Ordenes,
  },
  {
    path: '/orden/:numeroOrden',
    name: 'OrdenDetalle',
    component: OrdenDetalle,
  },
  {
    path: '/alarmas',
    name: 'Alarmas',
    component: HistoricoAlarmas,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
