import { Outlet } from 'react-router-dom'

import coral from '/coral.svg'
import logo from '/logo.svg'
import logo_mockup from '/logo_mock_up.svg'

const AuthLayout = () => {
  return (
    <div className="relative h-screen w-screen bg-[url('/public/CoralBG.webp')]">
      <div className="flex h-screen w-screen items-center justify-center bg-contain bg-repeat-y p-[50px] pt-[115px] lg:p-[134px]">
        <div className="flex h-full w-1/2 flex-col items-center justify-center gap-4">
          <div className="h-20 w-[400px]">
            <div className="relative w-full">
              <img className="absolute left-0 top-0" src={logo} alt="" />
              <img className="absolute left-0 top-0" src={logo_mockup} alt="" />
            </div>
          </div>
          <p className="text-4xl text-white">大聲交流，讓想法落地</p>
        </div>
        <div className="flex w-1/2 flex-col items-center gap-10">
          <Outlet />
        </div>
      </div>

      <img className="absolute bottom-0" src={coral} alt="" />
    </div>
  )
}

export default AuthLayout
