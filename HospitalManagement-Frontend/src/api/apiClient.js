import axios from 'axios'
import { getToken, clearAll } from '../utils/tokenStore'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
})

// Attach JWT to every request
apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// Handle 401 globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAll()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
