import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type State = {
  is_start_project: boolean
}

type Actions = {
  setStartProjectStatus: (status: boolean) => void
}

const useStartProject = create<State & Actions>()(
  immer((set) => ({
    is_start_project: false,
    setStartProjectStatus: (status: boolean) =>
      set((state) => {
        return { ...state, is_start_project: status }
      })
  }))
)

export default useStartProject
