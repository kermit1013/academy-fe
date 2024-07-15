import { useCallback, useEffect, useState, useRef } from 'react'
import ReactFlow, {
  Panel,
  ProOptions,
  ReactFlowProvider,
  NodeOrigin,
  NodeMouseHandler
} from 'reactflow'
import 'reactflow/dist/style.css'
import useForceLayout from '../hooks/useForceLayout'
import useNodesStateSynced from '../hooks/useNodesStateSynced'
import useEdgesStateSynced from '../hooks/useEdgesStateSynced'

import { message } from 'antd'
import Bubble from '../components/Bubble'
import axios from 'axios'
import useCursorStateSynced from '../hooks/useCursorStateSynced'
import Cursors from '../components/Cursors'
import { useNavigate } from 'react-router-dom'

import BrainStormContent from '../components/content/BrainStormContent'
import useTopMenu from '../hooks/useTopMenu'
import TallyPopup from '../components/TallyPopup'
import TallyStartProject from '../components/TallyStartProject'

import bg from '../../public/bg.svg'
import SettingModal from '../components/modal/SettingModal'
import Loading from '../components/Loading'
import useStartProject from '../hooks/useStartProject'
import useAheadDiscord from '../hooks/useAheadDiscord'
import DiscordModal from '../components/modal/DiscordModal'
import GalleryContent from '../components/content/GalleryContent'
// import CustomZoom from '../components/CustomZoom'
import NavDrawer from '../components/NavDrawer'
import { getNodeClassName } from '../funcs/utils'
const proOptions: ProOptions = { account: 'paid-pro', hideAttribution: true }

type ExampleProps = {
  strength?: number
  distance?: number
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

function ReactFlowPro({ strength = -300, distance = 300 }: ExampleProps = {}) {
  const [isLoading, setIsLoading] = useState(true)
  const [userIdList, setUserIdList] = useState<number[]>([])
  const [nodes, setNodes, onNodesChange] = useNodesStateSynced()
  const [edges, setEdges, onEdgesChange] = useEdgesStateSynced()
  const [cursors, onMouseMove] = useCursorStateSynced()
  const { is_start_project } = useStartProject()
  const { is_ahead_discord, setAheadDiscordStatus } = useAheadDiscord()
  const [userId, setUserId] = useState(0)
  const [messageApi, contextHolder] = message.useMessage()
  const [actionType, setActionType] = useState(0)
  const { isOpenBrainStormContent, isOpenGalleryContent, isOpenSettingModal, isOpenTallyPopup, setIsOpenTallyPopup } =
    useTopMenu()
  const [tooltipData, setTooltipData] = useState({ show: false, content: '', x: 0, y: 0 });

  useEffect(() => {
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
      console.log(actionType)
      const access_token = localStorage.getItem('access_token')
      if (!access_token) {
        navigate('/')
        return
      }

      let user_id: number | undefined

      if (action_type === -1) {
        if (userIdListRef.current.length > 1) {
          user_id = userIdListRef.current[userIdListRef.current.length - 2]
          console.log(user_id)
        } else {
          messageApi.warning('已經沒有上一位用戶了哦！')
          console.log('userIdList is empty')
          return
        }
      }
      const baseUrl = 'https://api.loudy.in/api/users/me'
      const url =
        action_type === -1
          ? `${baseUrl}?user_id=${user_id}`
          : action_type === 1
            ? `${baseUrl}?user_id=0`
            : baseUrl

      try {
        const result = await axios.get(url, {
          headers: { Authorization: `Bearer ${access_token}` }
        })

        updateUserIdList(action_type, result.data.id)
        if (action_type === 0) {
          setIsOpenTallyPopup(!result.data.has_submitted_tally)
        }

        const nodeList = mapNodesToReactFlow(
          result.data.nodes,
          result.data.username
        )
        const edgeList = mapEdgesToReactFlow(result.data.edges)

        updateStateAndStorage(result.data.id, nodeList, edgeList, action_type)
      } catch (error) {
        console.error('Error fetching data:', error)
        navigate('/')
      }
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
      position: { x: 0, y: 0 },
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
        is_visible: false
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

  useForceLayout({ strength, distance, setIsLoading, userId })

  const onNodeMouseEnter: NodeMouseHandler = useCallback(
    (event, node) => {
      const { clientX, clientY } = event as React.MouseEvent;
      if (!node.data.reference) return 
      if (node.data.level === 3) {
        setTooltipData({
          show: true,
          content: node.data.reference || 'unknown',
          x: clientX,
          y: clientY
        });
      }
    },
    []
  );


  const onNodeMouseLeave: NodeMouseHandler = useCallback(
    () => {
      setTooltipData(prev => ({ ...prev, show: false }));
    },
    []
  );

  const Tooltip = ({ content, x, y }: referenceTooltipProps) => (
    <div 
      className="absolute z-10 p-2 border border-[#7B7C7B]/10 bg-white/20 font-sans text-[13px] text-[#7B7C7B] rounded shadow-md"
      style={{ left: x, top: y }}
    >
      {content}
    </div>
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      const newNodeList = nodes.map((_node) => {
        if (_node.id === node.id) {
          const newNode = { ..._node }
          newNode.data = { ...newNode.data, isVisible: true }
          newNode.className = getNodeClassName({
            level: node.data.level,
            is_launched: node.data.is_launched,
            is_visible: true
          })
          return newNode
        } else {
          const newNode = { ..._node }
          newNode.data = { ...newNode.data, isVisible: false }
          newNode.className = getNodeClassName({
            level: newNode.data.level,
            is_launched: newNode.data.is_launched,
            is_visible: false
          })

          return newNode
        }
      })
      setNodes(newNodeList)
    },
    [nodes, edges]
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
        onPointerMove={onMouseMove}
        onNodeClick={onNodeClick}
        proOptions={proOptions}
        selectNodesOnDrag={false}
        nodeOrigin={nodeOrigin}
        zoomOnDoubleClick={false}
        className="intersection-flow relative h-screen w-screen font-serif"
        defaultEdgeOptions={defaultEdgeOptions}
      >
        {isLoading && <Loading />}
        {isOpenTallyPopup && (
          <TallyPopup
            getPersonData={() => getPersonData(0)}
            setActionType={setActionType}
          />
        )}
        {is_start_project && <TallyStartProject />}
        <Panel position="top-left">
          {/* <div className="flex items-center gap-1">
            <img className='w-4' src={main_logo} alt="" />
            <img className='w-16' src={text_logo} alt="" />
          </div> */}
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
        
        <img src={bg} className="object-cover w-full h-full" alt="" />
       
        <Cursors cursors={cursors} />
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
  const levaProps = {
    strength: -300,
    distance: 300
  }

  return (
    <ReactFlowProvider>
      <ReactFlowPro {...levaProps} />
    </ReactFlowProvider>
  )
}

export default ReactFlowWrapper
