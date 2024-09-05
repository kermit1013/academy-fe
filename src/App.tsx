import { message } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useLogin from './hooks/useLogin'

import GoogleLogin from './components/GoogleLogin'
import { TokenPair } from './libs/api/login'
import password_hide from '/password_hide.svg'
import password_show from '/password_show.svg'
import groundi_logo from '/groundi_logo.svg'

const App = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [passwdType, setPasswdType] = useState('password')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const { user_name, setUserName, passwd, setPasswd } = useLogin()

  useEffect(() => {
    const isMobile = /iPhone|iPod|Android/i.test(navigator.userAgent)
    if (isMobile) {
      alert('為了更好的使用體驗，建議您使用桌面版進行操作。')
    }
  }, [])

  const handlerChangePasswdType = () => {
    if (passwdType === 'password') {
      setPasswdType('text')
    } else {
      setPasswdType('password')
    }
  }
  const navigate = useNavigate()
  const handlerLogin = async () => {
    if (user_name === '' || passwd === '') {
      messageApi.warning('請輸入帳號、密碼')
      return
    }
    setIsLoggingIn(true)
    TokenPair(user_name, passwd)
      .then((result) => {
        localStorage.setItem('access_token', result.data.access)
        localStorage.setItem('refresh_token', result.data.refresh)
        messageApi.success(`歡迎${user_name}`)
        setTimeout(() => {
          navigate('/search')
        }, 1000)
      })
      .catch((e) => {
        setIsLoggingIn(false)
        messageApi.warning(`登入失敗，帳號或密碼錯誤${e}`)
        messageApi.warning(`${user_name}, ${passwd}`)
      })
  }
  const go2Register = () => {
    navigate('/register')
  }
  // const handlerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.code === 'Enter') {
  //     handlerLogin()
  //   }
  // }

  return (
    <div className="relative w-full sm:max-w-sm">
      <div className="relative w-full rounded-3xl border-2 border-[#7B7C7B] px-6 py-4 shadow-2xl">
        {contextHolder}
        <div className="flex flex-col items-center justify-center gap-4">
          <img className="w-1/3" src={groundi_logo} alt="" />
        </div>
        <div>
          <p className="text-md text-[#7B7C7B]">帳號</p>
          <input
            className="mt-1 block h-11 w-full rounded-xl border-2 border-[#7B7C7B] bg-[#7B7C7B]/10 pl-3 text-[#7B7C7B] shadow-lg hover:bg-[#735E5E]/20 focus:bg-[#735E5E]/20 focus:outline-none"
            type="text"
            value={user_name}
            onChange={(e) => {
              setUserName(e.target.value)
            }}
          />
        </div>
        <div className="mt-5">
          <p className="text-md text-[#7B7C7B]">密碼</p>
          <div className="relative">
            <input
              className="mt-1 block h-11 w-full rounded-xl border-2 border-[#7B7C7B] bg-[#7B7C7B]/10 pl-3 text-[#7B7C7B] shadow-lg hover:bg-[#735E5E]/20 focus:outline-none"
              type={passwdType}
              value={passwd}
              onChange={(e) => {
                setPasswd(e.target.value)
              }}
            />
            <button
              className="absolute right-3 top-3"
              onClick={() => handlerChangePasswdType()}
            >
              <img
                className="h-5 w-5 text-[#7B7C7B]"
                src={passwdType == 'text' ? password_show : password_hide}
                alt=""
              />
            </button>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            className="text-base text-[#7B7C7B] underline hover:cursor-pointer"
            onClick={() => {
              navigate('/forgetPwd')
            }}
          >
            忘記密碼?
          </button>
        </div>
        <button
          className={`text-md mt-4 w-full rounded-[20px] p-3 text-white ${isLoggingIn ? 'bg-[#ABAAA6]' : 'bg-[#735E5E]'} e-in-out hover:-translate-x shadow-md transition duration-500 hover:scale-105 hover:shadow-inner`}
          onClick={() => handlerLogin()}
          disabled={isLoggingIn}
        >
          登入
        </button>
        <div className="mt-4 flex w-full items-center justify-center gap-2">
          <p className="h-0 w-1/2 border border-[#7B7C7B]"></p>
          <p className="text-base text-[#7B7C7B]">或</p>
          <p className="h-0 w-1/2 border border-[#7B7C7B]"></p>
        </div>
        <GoogleLogin>
          {' '}
          <p>使用Gmail登入</p>
        </GoogleLogin>
        <div className="flex justify-center">
          <button
            className="mt-2 text-center text-base font-thin text-[#7B7C7B] underline hover:cursor-pointer"
            onClick={() => go2Register()}
          >
            還沒有帳號?註冊
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
