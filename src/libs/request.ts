import axios, { AxiosError } from 'axios'

const request = axios.create({
  // TODO: 到時使用 env 變數替換掉
  baseURL: 'https://api.loudy.in/api/'
})

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

request.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    if (error?.response?.status === 401) {
      console.error('Unauthorized request:', error)
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_id')
      localStorage.removeItem('user_name')
      localStorage.removeItem('roomName')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default request
