import { useCallback, useEffect, useRef, useState } from 'react'
import ELK from 'elkjs/lib/elk.bundled.js'
import ReactFlow, {
  MiniMap,
  NodeMouseHandler,
  NodeOrigin,
  Panel,
  ProOptions,
  ReactFlowProvider,
  useReactFlow,
  useNodesState,
  useEdgesState,
  NodeDragHandler
} from 'reactflow'
import 'reactflow/dist/style.css'

import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import Bubble from '../components/mindMap/Bubble'
import magic from '/magic.svg'
import fit_view from '/fit_view.svg'

import BrainStormContent from '../components/content/BrainStormContent'
import GalleryContent from '../components/content/GalleryContent'
import DiscordModal from '../components/modal/DiscordModal'
import SettingModal from '../components/modal/SettingModal'
import NavDrawer from '../components/NavDrawer'
import TallyPopup from '../components/tally/TallyPopup'
import TallyStartProject from '../components/tally/TallyStartProject'
import { getNodeClassName } from '../funcs/utils'
import { GetUserInfo } from '../libs/api/user'
import useAheadDiscordStore from '../stores/useAheadDiscordStore'
import useLoginStore from '../stores/useLoginStore'
import useStartProjectStore from '../stores/useStartProjectStore'
import useTopMenuStore from '../stores/useTopMenuStore'
import { BatchUpdateBubbles } from '../libs/api/bubble'
const proOptions: ProOptions = { account: 'paid-pro', hideAttribution: true }

const elk = new ELK()
const elkOptions = {
  'elk.algorithm': 'radial',
  'elk.radial.centerOnRoot': true,
  'elk.spacing.nodeNode': 10
}

const nodeTypes = {
  bubble: Bubble
}
const nodeOrigin: NodeOrigin = [0.5, 0.5]

const defaultEdgeOptions = {
  style: { stroke: '#7B7C7B', strokeWidth: 2 }
}

interface InputNode {
  id: number
  data: {
    label: string
    category: string
    is_launched: boolean
    level: number
    reference: string
    position: { x: number; y: number }
  }
}

interface referenceTooltipProps {
  content: string
  x: number
  y: number
}

interface InputEdge {
  source: number
  target: number
}

declare global {
  interface Window {
    Tally: any
  }
}

const getLayoutedElements = async (nodes: any, edges: any, options = {}) => {
  const graph = {
    id: 'root',
    layoutOptions: options,
    children: nodes.map((node: any) => ({
      ...node,
      width: 192,
      height: 58
    })),
    edges: edges
  }
  return elk
    .layout(graph)
    .then((layoutedGraph) => {
      if (!layoutedGraph || !layoutedGraph.children) {
        throw new Error('Invalid layout result')
      }
      return {
        nodes: layoutedGraph.children.map((node) => ({
          ...node,
          position: { x: node.x, y: node.y }
        })),
        edges: layoutedGraph.edges
      }
    })
    .catch(console.error)
}

function ReactFlowPro() {
  const { setUser } = useLoginStore()
  const { setSelectedNode, is_start_project } = useStartProjectStore()
  const { is_ahead_discord, setAheadDiscordStatus } = useAheadDiscordStore()
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [messageApi, contextHolder] = message.useMessage()
  const [userIdList, setUserIdList] = useState<number[]>([])
  const [userId, setUserId] = useState(0)
  const [actionType, setActionType] = useState(0)
  const { fitView } = useReactFlow()

  const {
    isOpenBrainStormContent,
    isOpenGalleryContent,
    isOpenSettingModal,
    isOpenTallyPopup,
    setIsOpenTallyPopup
  } = useTopMenuStore()
  const [tooltipData, setTooltipData] = useState({
    show: false,
    content: '',
    x: 0,
    y: 0
  })

  useEffect(() => {
    console.log(userId)
    getPersonData(0)
  }, [])

  const userIdListRef = useRef<number[]>([])

  // Update the ref whenever userIdList changes
  useEffect(() => {
    userIdListRef.current = userIdList
  }, [userIdList])

  const navigate = useNavigate()

  const getPersonData = useCallback(
    async (action_type: number) => {
      let user_id: number | undefined
      console.log(actionType)

      if (action_type === -1) {
        if (userIdListRef.current.length > 1) {
          user_id = userIdListRef.current[userIdListRef.current.length - 2]
        } else {
          messageApi.warning('已經沒有上一位用戶了哦！')
          return
        }
      }

      GetUserInfo(action_type, user_id)
        .then((result) => {
          updateUserIdList(action_type, result.id)
          if (action_type === 0) {
            setUser(result)
            setIsOpenTallyPopup(!result.has_submitted_tally)
          }

          const nodeList = mapNodesToReactFlow(result.nodes, result.username)
          const edgeList = mapEdgesToReactFlow(result.edges)

          updateStateAndStorage(result.id, nodeList, edgeList, action_type)
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
          navigate('/')
        })
    },
    [navigate, setUserIdList, setUserId, setNodes, setEdges]
  )

  const updateUserIdList = (action_type: number, id: number) => {
    if (action_type === 1) {
      setUserIdList((prev) => [...prev, id])
    } else if (action_type === -1) {
      setUserIdList((prev) => prev.slice(0, -1))
    }
  }

  const mapNodesToReactFlow = (nodes: InputNode[], username: string) => {
    return nodes.map((item) => ({
      id: `${item.id}`,
      type: 'bubble',
      position: item.data.position,
      data: {
        id: `${item.id}`,
        label: item.data.level === 0 ? username : item.data.label,
        category: item.data.category,
        level: item.data.level,
        is_launched: item.data.is_launched,
        reference: item.data.reference
      },
      className: getNodeClassName({
        level: item.data.level,
        is_launched: item.data.is_launched,
        is_visible: false,
        isOpenBrainStormContent: false
      })
    }))
  }

  const mapEdgesToReactFlow = (edges: InputEdge[]) => {
    return edges.map((item) => ({
      id: `${item.source}->${item.target}`,
      source: `${item.source}`,
      target: `${item.target}`,
      type: 'straight'
    }))
  }

  const updateStateAndStorage = (
    id: number,
    nodeList: any[],
    edgeList: any[],
    action_type: number
  ) => {
    setUserId(id)
    setNodes(nodeList)
    setEdges(edgeList)
    localStorage.setItem('user_id', id.toString())
    if (action_type !== 0) {
      localStorage.setItem('gallery_user_id', id.toString())
    }
  }

  const onNodeMouseEnter: NodeMouseHandler = useCallback((event, node) => {
    const { clientX, clientY } = event as React.MouseEvent
    if (!node.data.reference) return
    if (node.data.level === 3) {
      setTooltipData({
        show: true,
        content: node.data.reference || 'unknown',
        x: clientX,
        y: clientY
      })
    }
  }, [])

  const onNodeMouseLeave: NodeMouseHandler = useCallback(() => {
    setTooltipData((prev) => ({ ...prev, show: false }))
  }, [])

  const Tooltip = ({ content, x, y }: referenceTooltipProps) => (
    <div
      className="absolute z-10 rounded border border-[#7B7C7B]/10 bg-white/20 p-2 font-sans text-[13px] text-[#7B7C7B] shadow-md"
      style={{ left: x, top: y }}
    >
      {content}
    </div>
  )

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      setSelectedNode(node)
      const newNodeList = nodes.map((_node) => {
        if (_node.id === node.id) {
          const newNode = { ..._node }
          newNode.data = { ...newNode.data, isVisible: true }
          newNode.className = getNodeClassName({
            level: node.data.level,
            is_launched: node.data.is_launched,
            is_visible: true,
            isOpenBrainStormContent
          })
          return newNode
        } else {
          const newNode = { ..._node }
          newNode.data = { ...newNode.data, isVisible: false }
          newNode.className = getNodeClassName({
            level: newNode.data.level,
            is_launched: newNode.data.is_launched,
            is_visible: false,
            isOpenBrainStormContent
          })

          return newNode
        }
      })
      setNodes(newNodeList)
    },
    [nodes, edges, isOpenBrainStormContent]
  )
  const onLayout = useCallback(() => {
    getLayoutedElements(nodes, edges, elkOptions).then(
      ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
        BatchUpdateBubbles(
          layoutedNodes.map((node: any) => ({
            id: node.id,
            position: node.position
          }))
        )
        setNodes(layoutedNodes)
        setEdges(layoutedEdges)

        window.requestAnimationFrame(() => fitView())
      }
    )
  }, [nodes, edges])

  const handlerAutoLayout = () => {
    onLayout()
  }

  const onNodeDragStop: NodeDragHandler = useCallback(
    (event, node) => {
      const { clientX, clientY } = event as React.MouseEvent
      BatchUpdateBubbles([
        { id: node.id, position: { x: clientX, y: clientY } }
      ])
    },
    [nodes]
  )

  return (
    <>
      {contextHolder}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={onNodeDragStop}
        onNodeClick={onNodeClick}
        nodesConnectable={false}
        proOptions={proOptions}
        selectNodesOnDrag={false}
        nodeOrigin={nodeOrigin}
        zoomOnDoubleClick={false}
        className="intersection-flow relative h-screen w-screen font-serif"
        defaultEdgeOptions={defaultEdgeOptions}
        minZoom={0.3}
      >
        {isOpenTallyPopup && (
          <TallyPopup
            getPersonData={() => getPersonData(0)}
            setActionType={setActionType}
          />
        )}
        {is_start_project && <TallyStartProject />}
        <Panel position="top-left">
          <NavDrawer />
        </Panel>
        <Panel position="bottom-center">
          {isOpenBrainStormContent && <BrainStormContent />}
          {isOpenGalleryContent && (
            <GalleryContent
              getPersonData={getPersonData}
              setActionType={setActionType}
            />
          )}
        </Panel>

        {!isOpenGalleryContent && (
          <Panel position="top-right">
            {' '}
            <button
              title="自動排列"
              className={`e-in-out hover:-translate-x relative flex h-10 w-10 items-center justify-center rounded border border-[#7B7C7B] bg-[#7B7C7B]/10 shadow-md transition duration-500 hover:scale-105 hover:bg-[#7B7C7B]/10 hover:shadow-inner`}
              onClick={handlerAutoLayout}
            >
              <img src={magic} alt="" />
            </button>
            <button
              title=""
              className={`e-in-out hover:-translate-x relative mt-4 flex h-10 w-10 items-center justify-center rounded border border-[#7B7C7B] bg-[#7B7C7B]/10 shadow-md transition duration-500 hover:scale-105 hover:bg-[#7B7C7B]/10 hover:shadow-inner`}
              onClick={() => fitView()}
            >
              <img src={fit_view} alt="" />
            </button>{' '}
          </Panel>
        )}

        <MiniMap />
      </ReactFlow>
      <DiscordModal
        isOpen={is_ahead_discord}
        onClose={() => setAheadDiscordStatus(false)}
      />
      {isOpenSettingModal && <SettingModal />}
      {tooltipData.show && (
        <Tooltip
          content={tooltipData.content}
          x={tooltipData.x}
          y={tooltipData.y}
        />
      )}
    </>
  )
}

function ReactFlowWrapper() {
  return (
    <ReactFlowProvider>
      <ReactFlowPro />
    </ReactFlowProvider>
  )
}

export default ReactFlowWrapper
