import React, { useState } from 'react'
import coral from '../public/coral.svg'
import logo from '../public/logo.svg'
import logo_mockup from '../public/logo_mock_up.svg'
import { useNavigate } from 'react-router-dom'
const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const handlerChangePath = () => {
    if (email === '') {
      alert('請輸入信箱帳號!')
      return
    }
    localStorage.setItem('email', email)
    navigate('/search')
  }
  const handlerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      handlerChangePath()
    }
  }

  return (
    <div className="w-screen h-screen bg-[url('/public/CoralBG.png')] relative">
      <div className="flex w-screen h-screen pt-[120px] p-[50px] lg:p-[134px] bg-repeat-y justify-center items-center bg-contain">
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
          <p className="font-medium text-md text-2xl  w-fit  text-white `">
            登入來保存你的資料或與其他人一同發想
          </p>
          <div className=" w-max-[509px] h-[509px] border-2 border-white rounded-[50px] flex justify-between p-10 flex-col bg-white/20 z-20 backdrop-blur-sm">
            <div className=" ">
              <p className="pl-3 text-3xl text-white  font-medium">
                電子信箱帳號
              </p>
              <input
                className="rounded-full bg-white/30 border-2 mt-3 h-[76px] border-white focus:outline-none w-full pl-4 text-3xl text-white"
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
                onKeyDown={(e) => handlerKeyDown(e)}
              />
              <p className="text-2xl text-white font-medium mt-10 pl-3 italic">
                使用Gmail登入
              </p>
            </div>
            <div className="flex justify-between gap-5">
              <button className="w-[185px] h-[76px] text-3xl font-medium p-4 text-white border-2  border-white bg-white/30 rounded-[20px]">
                晚點再說
              </button>
              <button
                className="w-[185px] h-[76px] text-3xl font-medium p-4 text-white border-2  border-white bg-white/30 rounded-[20px]"
                onClick={handlerChangePath}
              >
                登入
              </button>
            </div>
          </div>
        </div>
      </div>

      <img className=" absolute bottom-0" src={coral} alt="" />
    </div>
  )
}

export default Login
