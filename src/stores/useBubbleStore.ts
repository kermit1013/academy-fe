import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { type Node, type Edge, NodeChange, EdgeChange } from 'reactflow'

type State = {
  node_list: Node[]
  edge_list: Edge[]
  edit_bubble_id: string
  isConnect: boolean
  MyRoomId: string
  imgUrl: string
  need_refresh: boolean
  select_bubble: Node | null
}

type Actions = {
  setNode: (list: Node[]) => void
  setEdge: (list: Edge[]) => void
  setImage: (url: string) => void
  setMyRoomId: (RoomId: string) => void
  setConnect: (status: boolean) => void
  setEditBubbleId: (id: string) => void
  onNodeChange: (node: NodeChange[]) => void
  onEdgeChange: (edge: EdgeChange[]) => void
  SetRefresh: (status: boolean) => void
  setSelectBubble: (bubble: Node | null) => void
}

const useBubbleStore = create<State & Actions>()(
  immer((set) => ({
    node_list: [],
    edge_list: [],
    select_bubble: null,
    edit_bubble_id: '',
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
    setEditBubbleId: (id: string) =>
      set((state) => {
        return { ...state, edit_bubble_id: id }
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
    setSelectBubble: (node: Node | null) =>
      set((state) => {
        return { ...state, select_bubble: node }
      })
  }))
)

export default useBubbleStore
