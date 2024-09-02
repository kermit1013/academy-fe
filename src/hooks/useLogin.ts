import { any } from 'zod'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type State = {
  isRegister: boolean
  email: string
  passwd: string
  user_name: string
  user: any
}

type Actions = {
  setIsRegister: (status: boolean) => void
  setEmail: (email: string) => void
  setPasswd: (passwd: string) => void
  setUserName: (user_name: string) => void
  setUser: (user: any) => void
}

const useLogin = create<State & Actions>()(
  immer((set) => ({
    isRegister: false,
    email: '',
    passwd: '',
    user_name: '',
    user: any,
    setIsRegister: (status: boolean) =>
      set((state) => {
        return { ...state, isRegister: status }
      }),
    setEmail: (email: string) =>
      set((state) => {
        return { ...state, email: email }
      }),
    setPasswd: (passwd: string) =>
      set((state) => {
        return { ...state, passwd: passwd }
      }),
    setUserName: (user_name: string) =>
      set((state) => {
        return { ...state, user_name: user_name }
      }),
    setUser: (user: any) =>
      set((state) => {
        return { ...state, user: user }
      }),
  }))
)

export default useLogin
