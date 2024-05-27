import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type State = {
  ReferenceUserId: string
}

type Actions = {
  setReferenceUserId: (user_id: string) => void
}

const useReferenceThink = create<State & Actions>()(
  immer((set) => ({
    ReferenceUserId: '',
    setReferenceUserId: (user_id: string) =>
      set((state) => {
        return { ...state, ReferenceUserId: user_id }
      }),
  }))
)

export default useReferenceThink
