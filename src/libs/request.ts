import axios, { AxiosError } from 'axios'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string
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
    switch (error?.response?.status) {
      case 401:
        console.error('Unauthorized request:', error)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user_id')
        localStorage.removeItem('username')
        localStorage.removeItem('roomName')

        if (window.location.pathname !== '/') {
          window.location.href = '/'
        }
        break

      default:
        break
    }

    return Promise.reject(error)
  }
)

export default request
