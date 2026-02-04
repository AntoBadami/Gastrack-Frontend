import { jwtDecode } from 'jwt-decode'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    username: null,
    email: null,
    roles: [],
    internalId: null,
    exp: null,
  }),

  getters: {
    isAuthenticated: (state) => {
      if (!state.token) return false
      const now = Math.floor(Date.now() / 1000)
      return !state.exp || state.exp > now
    },
  },

  actions: {
    setToken (token) {
      try {
        this.token = token

        const decoded = jwtDecode(token)

        this.username = decoded.sub || null
        this.email = decoded.email || null
        this.roles = decoded.roles || []
        this.internalId = decoded.internalId || null
        this.exp = decoded.exp || null

        localStorage.setItem('token', token)
      } catch (err) {
        console.error('Token inválido:', err)
        this.logout()
      }
    },

    loadFromStorage () {
      const token = localStorage.getItem('token')
      if (token) {
        this.setToken(token)
      }
    },

    logout () {
      this.$reset()
      localStorage.removeItem('token')
    },
  },
})
