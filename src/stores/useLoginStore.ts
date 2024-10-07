import { any } from 'zod'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type State = {
  email: string
  passwd: string
  username: string
  user: any
}

type Actions = {
  setEmail: (email: string) => void
  setPasswd: (passwd: string) => void
  setUserName: (username: string) => void
  setUser: (user: any) => void
}

const useLoginStore = create<State & Actions>()(
  immer((set) => ({
    email: '',
    passwd: '',
    username: '',
    user: any,
    setEmail: (email: string) =>
      set((state) => {
        return { ...state, email: email }
      }),
    setPasswd: (passwd: string) =>
      set((state) => {
        return { ...state, passwd: passwd }
      }),
    setUserName: (username: string) =>
      set((state) => {
        return { ...state, username: username }
      }),
    setUser: (user: any) =>
      set((state) => {
        return { ...state, user: user }
      })
  }))
)

export default useLoginStore
