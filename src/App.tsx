import { message } from 'antd'
import axios from 'axios'
import  { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useLogin from './hooks/useLogin'

import password_hide from '../public/password_hide.svg'
import password_show from '../public/password_show.svg'
import GoogleLogin from './components/GoogleLogin'

const LoginColumns = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [passwdType, setPasswdType] = useState('password')
  const { user_name, setUserName, passwd, setPasswd, setIsRegister } =
    useLogin()

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
      messageApi.warning('請先輸入帳號或密碼！')
    }
    try {
      const result = await axios.post('https://api.loudy.in/api/token/pair', {
        username: user_name,
        password: passwd
      })
      if (result.status == 200) {
        localStorage.setItem('access_token', result.data.data.access)
        localStorage.setItem('refresh_token', result.data.data.refresh)
        messageApi.success(`歡迎${user_name}回來~~~`)
        setTimeout(() => {
          navigate('/search')
        }, 2000)
      }
    } catch {
      messageApi.warning('帳號或密碼錯誤，若尚無註冊請先註冊後在登入！')
    }
  }

  // const handlerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.code === 'Enter') {
  //     handlerLogin()
  //   }
  // }

  return (
    <div className="z-20 flex h-[694px] w-[520px] flex-col justify-start gap-6 rounded-[50px] border-[3px] border-[#7B7C7B] p-10 backdrop-blur-sm">
      {contextHolder}
      <div>
        <p className="text-xl text-[#7B7C7B]">帳號</p>
        <input
          className="mt-3 h-[72px] w-full rounded-[20px] border-[3px] border-[#7B7C7B] bg-[#7B7C7B]/10 pl-4 text-3xl text-[#7B7C7B] focus:outline-none"
          type="text"
          value={user_name}
          onChange={(e) => {
            setUserName(e.target.value)
          }}
        />
      </div>
      <div>
        <p className="text-xl text-[#7B7C7B]">密碼</p>
        <div className="relative">
          <input
            className="mt-3 h-[72px] w-full rounded-[20px] border-[3px] border-[#7B7C7B] bg-[#7B7C7B]/10 pl-4 text-3xl text-[#7B7C7B] focus:outline-none"
            type={passwdType}
            value={passwd}
            onChange={(e) => {
              setPasswd(e.target.value)
            }}
          />
          <button
            className="absolute right-3 top-6"
            onClick={() => handlerChangePasswdType()}
          >
            <img
              className="h-full w-12 text-[#7B7C7B]"
              src={passwdType == 'text' ? password_show : password_hide}
              alt=""
            />
          </button>
        </div>
      </div>
      <div className="flex justify-end">
        <button className="text-xl text-[#7B7C7B] underline hover:cursor-pointer">
          忘記密碼?
        </button>
      </div>
      <button
        className="h-[72px] w-full rounded-[20px] bg-[#735E5E] p-4 text-2xl text-white"
        onClick={() => handlerLogin()}
      >
        登入
      </button>
      <div className="flex h-6 w-full items-center justify-center gap-2">
        <p className="h-0 w-1/2 border border-[#7B7C7B]"></p>
        <p className="text-2xl text-[#7B7C7B]">或</p>
        <p className="h-0 w-1/2 border border-[#7B7C7B]"></p>
      </div>
      <GoogleLogin>
        {' '}
        <p>使用Gmail登入</p>
      </GoogleLogin>
      <div className="flex justify-center">
        <button
          className="text-center text-xl font-thin text-[#7B7C7B] underline hover:cursor-pointer"
          onClick={() => setIsRegister(true)}
        >
          還沒有帳號?註冊
        </button>
      </div>
    </div>
  )
}

const RegisterColumns = () => {
  const [messageApi, contextHolder] = message.useMessage()

  const {
    email,
    setEmail,
    passwd,
    setPasswd,
    user_name,
    setUserName,
    setIsRegister
  } = useLogin()

  const [passwdType, setPasswdType] = useState('password')
  const handlerChangePasswdType = () => {
    if (passwdType === 'password') {
      setPasswdType('text')
    } else {
      setPasswdType('password')
    }
  }
  const handlerRegister = async () => {
    const expression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!expression.test(String(email).toLowerCase())) {
      messageApi.warning('信箱格式有誤!')
      return
    }

    try {
      await axios.post('https://api.loudy.in/api/users', {
      username: user_name,
      gender: '',
      email: email,
      school: '',
      grade: '',
      password: passwd
    })
      messageApi.success('註冊成功!')
      setTimeout(() => {
        setIsRegister(false)
      }, 2000)
    } catch (error : any) {
      if (error.response.status === 409) {
        await messageApi.error('此用戶名或信箱已被使用')
      }
    }
  }

  return (
    <div className="z-20 flex h-fit w-[520px] flex-col justify-start gap-6 rounded-[50px] border-[3px] border-[#7B7C7B] px-10 pb-[20px] pt-[50px] backdrop-blur-sm">
      {contextHolder}

      <div>
        <p className="text-xl text-[#7B7C7B]">電子信箱</p>
        <input
          className="mt-3 h-[72px] w-full rounded-[20px] border-[3px] border-[#7B7C7B] bg-[#7B7C7B]/10 pl-4 text-3xl text-[#7B7C7B] focus:outline-none"
          type="text"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
          }}
        />
      </div>
      <div>
        <p className="flex items-start text-xl text-[#7B7C7B]">用戶名稱</p>
        <input
          className="mt-3 h-[72px] w-full rounded-[20px] border-[3px] border-[#7B7C7B] bg-[#7B7C7B]/10 pl-4 text-3xl text-[#7B7C7B] focus:outline-none"
          type="text"
          value={user_name}
          onChange={(e) => {
            setUserName(e.target.value)
          }}
        />
      </div>
      <div>
        <p className="text-xl text-[#7B7C7B]">密碼</p>
        <div className="relative">
          <input
            className="mt-3 h-[72px] w-full rounded-[20px] border-[3px] border-[#7B7C7B] bg-[#7B7C7B]/10 pl-4 text-3xl text-[#7B7C7B] focus:outline-none"
            type={passwdType}
            value={passwd}
            onChange={(e) => {
              setPasswd(e.target.value)
            }}
          />
          <button
            className="absolute right-3 top-6"
            onClick={() => handlerChangePasswdType()}
          >
            <img
              className="h-full w-12 text-[#7B7C7B]"
              src={passwdType == 'text' ? password_show : password_hide}
              alt=""
            />
          </button>
        </div>
      </div>

      <button
        className="h-[72px] w-full rounded-[20px] bg-[#735E5E] p-4 text-2xl text-white"
        onClick={() => handlerRegister()}
      >
        註冊
      </button>
      <div className="flex h-6 w-full items-center justify-center gap-2">
        <p className="h-0 w-1/2 border border-[#7B7C7B]"></p>
        <p className="text-2xl text-[#7B7C7B]">或</p>
        <p className="h-0 w-1/2 border border-[#7B7C7B]"></p>
      </div>
      <GoogleLogin>
        {' '}
        <p>使用Gmail註冊</p>
      </GoogleLogin>
      <div className="flex justify-center">
        <button
          className="text-xl font-thin text-[#7B7C7B] underline hover:cursor-pointer"
          onClick={() => setIsRegister(false)}
        >
          已經有帳號?登入
        </button>
      </div>
    </div>
  )
}

const Login = () => {
  const { isRegister } = useLogin()

  return <>{isRegister ? <RegisterColumns /> : <LoginColumns />}</>
}

export default Login
