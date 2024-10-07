import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

// NOTE: 沒有使用到，可以刪除(?)

type State = {
  isContentVisible: boolean
  timer: number | null
}

type Actions = {
  setIsContentVisible: (status: boolean) => void
  setTimer: (timer: number | null) => void
}

const useThinkContentStore = create<State & Actions>()(
  immer((set) => ({
    isContentVisible: false,
    timer: null,
    times: 60,
    setIsContentVisible: (status: boolean) =>
      set((state) => {
        return { ...state, isContentVisible: status }
      }),
    setTimer: (timer: number | null) =>
      set((state) => {
        return { ...state, timer: timer }
      }),
  }))
)

export default useThinkContentStore
