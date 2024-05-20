import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type State = {
  isContentVisible: boolean
  timer: number | null
}

type Actions = {
  setIsContentVisible: (status: boolean) => void
  setTimer: (timer: number | null) => void
}

const useThinkContent = create<State & Actions>()(
  immer((set) => ({
    isContentVisible: false,
    timer: null,
    times: 60,
    setIsContentVisible: (status: boolean) =>
      set((state) => {
        console.log(status)
        return { ...state, isContentVisible: status }
      }),
    setTimer: (timer: number | null) =>
      set((state) => {
        return { ...state, timer: timer }
      }),
  }))
)

export default useThinkContent
