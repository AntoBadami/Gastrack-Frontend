import axios from 'axios'

const api = axios.create({
  baseURL: 'http://143.0.100.211:443/api/v1',
})

// Agregar el token automáticamente
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
