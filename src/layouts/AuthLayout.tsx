import { Outlet } from 'react-router-dom'

import bg from '/bg.svg'
const AuthLayout = () => {
  return (
    <div className="relative h-screen w-screen" style={{ backgroundImage: `url(${bg})` }}>

      <div className="flex h-screen w-screen items-center justify-center bg-contain bg-repeat-y p-[50px] pt-[115px] lg:p-[134px]">
        <div className="flex w-1/2 flex-col items-center gap-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
