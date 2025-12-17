import axios from 'axios'

const api = axios.create({
  baseURL: 'https://lbiondi.mooo.com/api/v1',
})

// Agregar el token automáticamente
api.interceptors.request.use(config => {
  // 🔥 NO agregar token en login
  if (!config.url.includes('/login')) {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

export default api
