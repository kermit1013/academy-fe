import { useGoogleLogin } from '@react-oauth/google' 
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { PropsWithChildren } from 'react'
import axios from 'axios'

const GoogleLogin = ({ children }: PropsWithChildren) => {
  const [messageApi, contextHolder] = message.useMessage()
  const navigate = useNavigate()

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const result = await axios.post(
          'https://api.loudy.in/api/users/auth-receiver',
          {
            credential: tokenResponse.access_token
          }
        )

        if (result.status === 200) {
          localStorage.setItem('access_token', result.data.data.access)
          localStorage.setItem('refresh_token', result.data.data.refresh)
          messageApi.success('Google Sign-In successful!')
          setTimeout(() => {
            navigate('/search')
          }, 1000)
        }
      } catch (error) {
        console.error('Error during Google Sign-In:', error)
        messageApi.warning('Google Sign-In failed. Please try again.')
      }
    }
  })
  return (
    <>
      {contextHolder}
      <button
        className="mt-4 w-full rounded-[20px] border-2 border-[#7B7C7B] bg-white/30 p-3 text-md text-[#7B7C7B] backdrop-blur-sm shadow-md hover:shadow-inner e-in-out transition duration-500 hover:-translate-x hover:scale-105"
        onClick={() => googleLogin()}
      >
        {children}
      </button>
    </>
  )
}

export default GoogleLogin
