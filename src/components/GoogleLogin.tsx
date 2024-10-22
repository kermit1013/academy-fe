import { useGoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { PropsWithChildren } from 'react'
import { OauthGoogle } from '../libs/api/login'

const GoogleLogin = ({ children }: PropsWithChildren) => {
  const [messageApi, contextHolder] = message.useMessage()
  const navigate = useNavigate()

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      OauthGoogle(tokenResponse.access_token)
        .then((result) => {
          localStorage.setItem('access_token', result.data.access)
          localStorage.setItem('refresh_token', result.data.refresh)
          messageApi.success('Google Sign-In successful!')
          setTimeout(() => {
            navigate('/dashboard')
          }, 1000)
        })
        .catch((e) => {
          console.error('Error during Google Sign-In:', e)
          messageApi.warning('Google Sign-In failed. Please try again.')
        })
    }
  })
  return (
    <>
      {contextHolder}
      <button
        className="text-md e-in-out hover:-translate-x mt-4 w-full rounded-[20px] border-2 border-[#7B7C7B] bg-white/30 p-3 text-[#7B7C7B] shadow-md backdrop-blur-sm transition duration-500 hover:scale-105 hover:shadow-inner"
        onClick={() => googleLogin()}
      >
        {children}
      </button>
    </>
  )
}

export default GoogleLogin
