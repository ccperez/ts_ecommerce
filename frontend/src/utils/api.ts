import axios from 'axios'

axios.defaults.baseURL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '/'

export default {
  product: {
    list: () => axios.get('/api/products'),
  },
}
