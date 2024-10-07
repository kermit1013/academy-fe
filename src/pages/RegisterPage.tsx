import { message } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useLoginStore from '../stores/useLoginStore'

import GoogleLogin from '../components/GoogleLogin'
import { RegisterUser } from '../libs/api/login'
import groundi_logo from '/groundi_logo.svg'
import password_hide from '/password_hide.svg'
import password_show from '/password_show.svg'

const RegisterPage = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const navigate = useNavigate()

  const { email, setEmail, passwd, setPasswd, username, setUserName } =
    useLoginStore()

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
    RegisterUser(username, email, passwd)
      .then(() => {
        messageApi.success('註冊成功')
        setTimeout(() => {
          navigate('/', { replace: true })
        }, 2000)
      })
      .catch((error) => {
        if (error.response.status === 409) {
          messageApi.error('此用戶名稱已被使用')
        } else {
          messageApi.error('註冊失敗')
        }
      })
  }

  return (
    <div className="relative w-full sm:max-w-sm">
      <div className="relative w-full rounded-3xl border-2 border-[#7B7C7B] px-6 py-4 shadow-2xl">
        {contextHolder}
        <div className="flex flex-col items-center justify-center gap-4">
          <img className="w-1/3" src={groundi_logo} alt="" />
        </div>
        <div>
          <p className="text-md text-[#7B7C7B]">電子信箱</p>
          <input
            className="mt-1 block h-11 w-full rounded-xl border-2 border-[#7B7C7B] bg-[#7B7C7B]/10 pl-3 text-[#7B7C7B] shadow-lg hover:bg-[#735E5E]/20 focus:bg-[#735E5E]/20 focus:outline-none"
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
          />
        </div>
        <div className="mt-5">
          <p className="text-md text-[#7B7C7B]">用戶名稱</p>
          <input
            className="mt-1 block h-11 w-full rounded-xl border-2 border-[#7B7C7B] bg-[#7B7C7B]/10 pl-3 text-[#7B7C7B] shadow-lg hover:bg-[#735E5E]/20 focus:bg-[#735E5E]/20 focus:outline-none"
            type="text"
            value={username}
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

        <button
          className="text-md hover:-translate-x mt-7 w-full rounded-[20px] bg-[#735E5E] p-3 text-white shadow-md transition duration-500 hover:scale-105 hover:shadow-inner"
          onClick={() => handlerRegister()}
        >
          註冊
        </button>
        <div className="mt-4 flex w-full items-center justify-center gap-2">
          <p className="h-0 w-1/2 border border-[#7B7C7B]"></p>
          <p className="text-base text-[#7B7C7B]">或</p>
          <p className="h-0 w-1/2 border border-[#7B7C7B]"></p>
        </div>
        <GoogleLogin>
          <p>使用Gmail註冊</p>
        </GoogleLogin>
        <div className="flex justify-center">
          <button
            className="mt-2 text-center text-base font-thin text-[#7B7C7B] underline hover:cursor-pointer"
            onClick={() => navigate('/', { replace: true })}
          >
            已經有帳號?登入
          </button>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
