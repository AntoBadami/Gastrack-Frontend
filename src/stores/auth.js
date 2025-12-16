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
    isAuthenticated: state => !!state.token,
  },

  actions: {
    setToken (token) {
      this.token = token

      const decoded = jwtDecode(token)

      this.username = decoded.sub
      this.email = decoded.email
      this.roles = decoded.roles || []
      this.internalId = decoded.internalId
      this.exp = decoded.exp

      localStorage.setItem('token', token)
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
