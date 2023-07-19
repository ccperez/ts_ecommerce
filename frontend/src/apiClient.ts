import axios from 'axios'
import fn from './functions/common'

const apiClient = axios.create({
  baseURL: fn.baseURL,
  headers: { 'Content-type': 'application/json' },
})

apiClient.interceptors.request.use(
  async (config) => {
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo)
      config.headers.authorization = `Bearer ${JSON.parse(userInfo!).token}`
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

export default apiClient
