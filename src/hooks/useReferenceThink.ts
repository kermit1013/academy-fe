import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type State = {
  reference_user_id: string
  can_reference: boolean
}

type Actions = {
  setReferenceUserId: (user_id: string) => void
  setCanReference: (status: boolean) => void
}

const useReferenceThink = create<State & Actions>()(
  immer((set) => ({
    reference_user_id: '',
    can_reference: false,
    setReferenceUserId: (user_id: string) =>
      set((state) => {
        return { ...state, reference_user_id: user_id }
      }),
    setCanReference: (status: boolean) =>
      set((state) => {
        return { ...state, can_reference: status }
      })
  }))
)

export default useReferenceThink
