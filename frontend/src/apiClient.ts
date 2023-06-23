import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.DEV ? 'http://localhost:5000' : '/',
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
