import axios from 'axios'
import { getToken, clearAll } from '../utils/tokenStore'

const apiClient = axios.create({
  baseURL: '/api/v1',
})

// Attach JWT to every request
apiClient.interceptors.request.use((config) => {
  const token = getToken()

  config.headers = config.headers || {}

  config.headers['Content-Type'] = 'application/json'

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }

  return config
})

export default apiClient