import React, { useState } from 'react'
import coral from '../public/coral.svg'
import logo from '../public/logo.svg'
import logo_mockup from '../public/logo_mock_up.svg'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import useLogin from './hooks/useLogin'
import { message } from 'antd'
import password_hide from '../public/password_hide.svg'
import password_show from '../public/password_show.svg'
import { GoogleLogin } from '@react-oauth/google';

const LoginColumns = () => {
  const [messageApi, contextHolder] = message.useMessage()

  const { user_name, setUserName, passwd, setPasswd, setIsRegister } =
    useLogin()
  const navigate = useNavigate()
  const handlerLogin = async () => {
    if (user_name === '' || passwd === '') {
      messageApi.warning('請先輸入帳號或密碼！')
    }
    try {
      const result = await axios.post('https://api.loudy.in/api/token/pair', {
        username: user_name,
        password: passwd,
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

  const handlerGoogleLogin = GoogleLogin({
    onSuccess: async (response) => {
      try {
        const result = await axios.post('https://api.loudy.in/api/users/auth-receiver', {
          credential: response.credential,
        });
  
        if (result.status === 200) {
          localStorage.setItem('access_token', result.data.data.access);
          localStorage.setItem('refresh_token', result.data.data.refresh);
          messageApi.success('Google Sign-In successful!');
          setTimeout(() => {
            navigate('/search');
          }, 2000);
        }
      } catch (error) {
        console.error('Error during Google Sign-In:', error);
        messageApi.warning('Google Sign-In failed. Please try again.');
      }
    },
  });

  const handlerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      handlerLogin()
    }
  }

  return (
    <div className=" w-[520px] h-[694px] border-2 border-white rounded-[50px] flex justify-start p-10 flex-col gap-6 bg-white/20 z-20 backdrop-blur-sm">
      {contextHolder}
      <div>
        <p className="pl-3 text-xl text-white">帳號</p>
        <input
          className="rounded-[20px] bg-white/30 border-2 mt-3 h-[72px] border-white focus:outline-none w-full pl-4 text-3xl text-white"
          type="text"
          value={user_name}
          onChange={(e) => {
            setUserName(e.target.value)
          }}
        />
      </div>
      <div>
        <p className="pl-3 text-xl text-white">密碼</p>
        <input
          className="rounded-[20px] bg-white/30 border-2 mt-3 h-[72px] border-white focus:outline-none w-full pl-4 text-3xl text-white"
          type="password"
          value={passwd}
          onChange={(e) => {
            setPasswd(e.target.value)
          }}
          onKeyDown={(e) => handlerKeyDown(e)}
        />
      </div>
      <div className="flex justify-end">
        <button className=" underline text-white text-xl hover:cursor-pointer">
          忘記密碼?
        </button>
      </div>
      <button
        className="w-full h-[72px] text-2xl p-4 text-[#385BA3] border-2  border-white bg-white/70 rounded-[20px]"
        onClick={() => handlerLogin()}
      >
        登入
      </button>
      <div className="w-full h-6 flex justify-center items-center gap-2">
        <p className="w-1/2 h-0 border border-white"></p>
        <p className="text-2xl text-white">or</p>
        <p className="w-1/2 h-0 border border-white"></p>
      </div>
      <button
        className="w-full h-[72px] text-2xl p-4 text-white border-2  border-white bg-white/30 rounded-[20px] backdrop-blur-sm"
        title="輸入信箱後註冊即可馬上發想！"
      >
        使用Gmail登入
      </button>
      <GoogleLogin
        onSuccess={()=>handlerGoogleLogin}
        useOneTap
      />
      <div className="flex justify-end">
        <button
          className=" underline text-white text-xl hover:cursor-pointer"
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
    setIsRegister,
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

    const result = await axios.post('https://api.loudy.in/api/users/', {
      username: user_name,
      gender: '',
      email: email,
      school: '',
      grade: '',
      password: passwd,
    })

    if (result.status === 200) {
      messageApi.success('註冊成功!')
      setTimeout(() => {
        setIsRegister(false)
      }, 2000)
    } else {
      messageApi.error(result.data)
    }
  }

  return (
    <div className=" w-[520px] h-fit border-2 border-white rounded-[50px] flex justify-start px-10 pt-[50px] pb-[20px] flex-col gap-6 bg-white/20 z-20 backdrop-blur-sm">
      {contextHolder}
      <div>
        <p className="pl-3 text-xl text-white">電子信箱</p>
        <input
          className="rounded-[20px] bg-white/30 border-2 mt-3 h-[72px] border-white focus:outline-none w-full pl-4 text-3xl text-white"
          type="text"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
          }}
        />
      </div>
      <div>
        <p className="pl-3 text-xl text-white">用戶名稱</p>
        <input
          className="rounded-[20px] bg-white/30 border-2 mt-3 h-[72px] border-white focus:outline-none w-full pl-4 text-3xl text-white"
          type="text"
          value={user_name}
          onChange={(e) => {
            setUserName(e.target.value)
          }}
        />
      </div>
      <div>
        <p className="pl-3 text-xl text-white">密碼</p>
        <div className=" relative">
          <input
            className="rounded-[20px] bg-white/30 border-2 mt-3 h-[72px] border-white focus:outline-none w-full pl-4 text-3xl text-white"
            type={passwdType}
            value={passwd}
            onChange={(e) => {
              setPasswd(e.target.value)
            }}
          />
          <button
            className=" absolute right-3 top-6"
            onClick={() => handlerChangePasswdType()}
          >
            <img
              className="w-12 h-full text-white"
              src={passwdType == 'text' ? password_hide : password_show}
              alt=""
            />
          </button>
        </div>
      </div>

      <button
        className="w-full h-[72px] text-2xl p-4 text-[#385BA3] border-2  border-white bg-white/70 rounded-[20px]"
        onClick={() => handlerRegister()}
      >
        註冊
      </button>
      <div className="w-full h-6 flex justify-center items-center gap-2">
        <p className="w-1/2 h-0 border border-white"></p>
        <p className="text-2xl text-white">or</p>
        <p className="w-1/2 h-0 border border-white"></p>
      </div>
      <button
        className="w-full h-[72px] text-2xl p-4 text-white border-2  border-white bg-white/30 rounded-[20px] backdrop-blur-sm"
        title="輸入信箱後註冊即可馬上發想！"
      >
        使用Gmail註冊
      </button>
      <div className="flex justify-center">
        <button
          className=" underline text-white text-xl hover:cursor-pointer"
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

  return (
    <div className="w-screen h-screen bg-[url('/public/CoralBG.webp')] relative">
      <div className="flex w-screen h-screen pt-[115px] p-[50px] lg:p-[134px] bg-repeat-y justify-center items-center bg-contain">
        <div className="w-1/2 flex items-center flex-col gap-4 justify-center h-full ">
          <div className=" w-[400px] h-20">
            <div className=" relative w-full">
              <img className=" absolute top-0 left-0" src={logo} alt="" />
              <img
                className=" absolute top-0 left-0"
                src={logo_mockup}
                alt=""
              />
            </div>
          </div>
          <p className="text-4xl text-white">大聲交流，讓想法落地</p>
        </div>
        <div className="flex items-center flex-col w-1/2 gap-10">
          {isRegister ? <RegisterColumns /> : <LoginColumns />}
        </div>
      </div>

      <img className=" absolute bottom-0" src={coral} alt="" />
    </div>
  )
}

export default Login
