import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { type Node } from 'reactflow'

type State = {
  is_start_project: boolean,
  selectedNode: Node | null
}

type Actions = {
  setStartProjectStatus: (status: boolean) => void
  setSelectedNode: (node: Node | null) => void
}

const useStartProject = create<State & Actions>()(
  immer((set) => ({
    is_start_project: false,
    selectedNode: null,
    setStartProjectStatus: (status: boolean) =>
      set((state) => {
        return { ...state, is_start_project: status }
      }),
    setSelectedNode: ( node: Node | null) =>
      set((state) => {
        return { ...state, selectedNode: node }
      }),
  }))
)

export default useStartProject
