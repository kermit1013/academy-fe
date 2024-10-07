import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type State = {
  is_ahead_discord: boolean
}

type Actions = {
  setAheadDiscordStatus: (status: boolean) => void
}

const useAheadDiscordStore = create<State & Actions>()(
  immer((set) => ({
    is_ahead_discord: false,
    setAheadDiscordStatus: (status: boolean) =>
      set((state) => {
        return { ...state, is_ahead_discord: status }
      })
  }))
)

export default useAheadDiscordStore
