import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type State = {
  isOpen: boolean
  projectId: string
  nodeId: string
  editable: boolean
}

type Actions = {
  setIsOpen: (isOpen: boolean) => void
  setProjectId: (projectId: string) => void
  setNodeId: (nodeId: string) => void
  setEditable: (editable: boolean) => void
}

const useEditor = create<State & Actions>()(
  immer((set) => ({
    isOpen: false,
    projectId: '',
    nodeId: '',
    editable: false,
    setIsOpen: (isOpen: boolean) =>
      set((state) => {
        return { ...state, isOpen: isOpen }
      }),
    setProjectId: (projectId: string) =>
      set((state) => {
        return { ...state, projectId: projectId }
      }),
    setNodeId: (nodeId: string) =>
      set((state) => {
        return { ...state, nodeId: nodeId }
      }),
    setEditable: (editable: boolean) =>
      set((state) => {
        return { ...state, editable: editable }
      }),
   
  }))
)

export default useEditor
