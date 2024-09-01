import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import {
  type Node,
  type Edge,
  NodeChange,
  EdgeChange,
  useReactFlow
} from 'reactflow'
import { getNodeClassName } from '../funcs/utils'
import useNodesStateSynced from './useNodesStateSynced'
import useEdgesStateSynced from './useEdgesStateSynced'

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

type NewBubble = {
  id: string
  label: string
  category: string
  isVisible: boolean
  level: number
  is_launched: boolean
  reference: any
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
  RenderNewBubble: (data_id: string, bubble: NewBubble) => void
}

const useBubble = create<State & Actions>()(
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
      }),
    RenderNewBubble: (data_id: string, bubble: NewBubble) =>
      set(() => {
        const { getNodes } = useReactFlow()
        const setNodes = useNodesStateSynced()[1]
        const setEdges = useEdgesStateSynced()[1]
        const childNode = {
          id: `${bubble.id}`,
          type: 'bubble',
          position: { x: 0, y: 0 },
          data: {
            id: `${bubble.id}`,
            label: bubble.label,
            category: bubble.category,
            isVisible: bubble.isVisible,
            level: bubble.level,
            is_launched: bubble.is_launched,
            reference: bubble.reference
          },
          className: getNodeClassName({
            level: bubble.level,
            is_launched: bubble.is_launched,
            is_visible: bubble.isVisible
          })
        }
        const childEdge = {
          id: `${data_id}->${bubble.id}`,
          source: `${data_id}`,
          target: `${bubble.id}`,
          type: 'straight'
        }

        const nodesList = getNodes().map((node) => {
          if (node.id === data_id) {
            const newNode = { ...node }
            newNode.data = { ...node.data, isVisible: false }

            return newNode
          }
          return node
        })

        const newNodeList = nodesList.concat(childNode)
        setNodes(newNodeList)
        setEdges((eds) => [...eds, childEdge])

        return
      })
  }))
)

export default useBubble
