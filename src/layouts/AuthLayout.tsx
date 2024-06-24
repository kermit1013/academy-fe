import { Outlet } from 'react-router-dom'

import bg from '/bg.svg'

import groundi_text from '/groundi_text.svg'
import groundi_logo from '/groundi_logo.svg'
const AuthLayout = () => {
  return (
    <div className="relative h-screen w-screen">
      <img src={bg} className="absolute bottom-0 -z-50 w-screen" alt="" />
      <div className="flex h-screen w-screen items-center justify-center bg-contain bg-repeat-y p-[50px] pt-[115px] lg:p-[134px]">
        <div className="flex h-full w-1/2 flex-col items-center justify-center gap-4">
          <img src={groundi_logo} alt="" />
          <img src={groundi_text} alt="" />
        </div>
        <div className="flex w-1/2 flex-col items-center gap-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
