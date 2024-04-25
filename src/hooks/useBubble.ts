import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { type Node, type Edge, NodeChange, EdgeChange } from 'reactflow'

type State = {
  node_list: Node[]
  edge_list: Edge[]
  isEdit: boolean
  isConnect: boolean
  MyRoomId: string
  imgUrl: string
  need_refresh: boolean
}

type Actions = {
  setNode: (list: Node[]) => void
  setEdge: (list: Edge[]) => void
  setImage: (url: string) => void
  setMyRoomId: (RoomId: string) => void
  setConnect: (status: boolean) => void
  setIsEdit: (status: boolean) => void
  onNodeChange: (node: NodeChange[]) => void
  onEdgeChange: (edge: EdgeChange[]) => void
  SetRefresh: (status: boolean) => void
}

const useBubble = create<State & Actions>()(
  immer((set) => ({
    node_list: [],
    edge_list: [],
    isEdit: false,
    isConnect: false,
    MyRoomId: '',
    need_refresh: false,
    imgUrl: '',
    setNode: (list: Node[]) =>
      set((state) => {
        return { ...state, node_list: list }
      }),
    setEdge: (list: Edge[]) =>
      set((state) => {
        return { ...state, edge_list: list }
      }),
    setImage: (url: string) =>
      set((state) => {
        return { ...state, imgUrl: url }
      }),
    setMyRoomId: (MyRoomId: string) =>
      set((state) => {
        return { ...state, MyRoomId }
      }),
    setConnect: (status: boolean) =>
      set((state) => {
        return { ...state, isConnect: status }
      }),
    setIsEdit: (status: boolean) =>
      set((state) => {
        return { ...state, ised: status }
      }),
    onNodeChange: (node: NodeChange[]) =>
      set((state) => {
        return { ...state, nodes: node }
      }),
    SetRefresh: (status: boolean) =>
      set((state) => {
        return { ...state, need_refresh: status }
      }),
    onEdgeChange: (node: EdgeChange[]) =>
      set((state) => {
        return { ...state, nodes: node }
      }),
  }))
)

export default useBubble
