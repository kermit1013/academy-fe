import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-contain bg-repeat-y p-[50px] pt-[115px] lg:p-[134px]">
      <div className="flex w-1/2 flex-col items-center gap-10">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
