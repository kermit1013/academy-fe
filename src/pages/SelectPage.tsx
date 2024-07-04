import { useCallback, useEffect, useState, useRef } from 'react'
import ReactFlow, {
  Panel,
  ProOptions,
  ReactFlowProvider,
  NodeOrigin,
  NodeMouseHandler,
  MiniMap,
} from 'reactflow'
import 'reactflow/dist/style.css'
import useForceLayout from '../hooks/useForceLayout'
import useNodesStateSynced from '../hooks/useNodesStateSynced'
import useEdgesStateSynced from '../hooks/useEdgesStateSynced'
import styles from '../styles.module.css'

import Bubble from '../components/Bubble'
import axios from 'axios'
import useCursorStateSynced from '../hooks/useCursorStateSynced'
import Cursors from '../components/Cursors'
import { useNavigate } from 'react-router-dom'
import main_logo from '../../public/main_page_logo.svg'

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
import TopMenu from '../components/TopMenu'
import GalleryContent from '../components/content/GalleryContent'
import CustomZoom from '../components/CustomZoom'
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
  }
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

  const [hasSubmitTally, setHasSubmitTally] = useState(true)
  const [actionType, setActionType] = useState(0)
  const { isOpenBrainStormContent, isOpenGalleryContent, isOpenSettingModal } =
    useTopMenu()

  useEffect(() => {
    getPersonData(0)
  }, [])

  const userIdListRef = useRef<number[]>([]);

  // Update the ref whenever userIdList changes
  useEffect(() => {
    console.log(userIdListRef)
    userIdListRef.current = userIdList;
  }, [userIdList]);

  const navigate = useNavigate()

  const getPersonData = useCallback(async (action_type: number) => {
    console.log(actionType)
    const access_token = localStorage.getItem('access_token')
    if (!access_token) {
      navigate('/')
      return
    }

    let user_id: number | undefined;

    if (action_type === -1) {
      if (userIdListRef.current.length > 0) {
        user_id = userIdListRef.current[userIdListRef.current.length - 2];
        console.log(user_id);
      } else {
        console.log("userIdList is empty");
        return;
      }
    }
    const baseUrl = 'https://api.loudy.in/api/users/me'
    const url = action_type === -1 ? `${baseUrl}?user_id=${user_id}` :
      action_type === 1 ? `${baseUrl}?user_id=0` :
        baseUrl

    try {
      const result = await axios.get(url, {
        headers: { Authorization: `Bearer ${access_token}` }
      })

      updateUserIdList(action_type, result.data.id)
      if (action_type === 0) {
        setHasSubmitTally(result.data.has_submitted_tally)
      }

      const nodeList = mapNodesToReactFlow(result.data.nodes, result.data.username)
      const edgeList = mapEdgesToReactFlow(result.data.edges)

      updateStateAndStorage(result.data.id, nodeList, edgeList, action_type)
    } catch (error) {
      console.error("Error fetching data:", error)
      navigate('/')
    }
  }, [navigate, setUserIdList, setHasSubmitTally, setUserId, setNodes, setEdges])

  const updateUserIdList = (action_type: number, id: number) => {
    if (action_type === 1) {
      setUserIdList(prev => [...prev, id])
    } else if (action_type === -1) {
      setUserIdList(prev => prev.slice(0, -1))
    }
  }

  const mapNodesToReactFlow = (nodes: InputNode[], username: string) => {
    return nodes.map(item => ({
      id: `${item.id}`,
      type: 'bubble',
      position: { x: 0, y: 0 },
      data: {
        id: `${item.id}`,
        label: item.data.level === 0 ? username : item.data.label,
        category: item.data.category,
        level: item.data.level,
        is_launched: item.data.is_launched
      },
      className: getNodeClassName(item.data)
    }))
  }

  const getNodeClassName = (data: { level: number, is_launched: boolean }) => {
    if (data.level === 0) return styles.node1_center
    if (data.level === 1) return styles.node1_level1_node
    if (data.level === 2) return styles.node1_level2_node
    if (data.level === 3 && data.is_launched) return styles.node1_level3_node_is_launched
    return styles.node1_level3_node
  }

  const mapEdgesToReactFlow = (edges: InputEdge[]) => {
    return edges.map(item => ({
      id: `${item.source}->${item.target}`,
      source: `${item.source}`,
      target: `${item.target}`,
      type: 'straight'
    }))
  }

  const updateStateAndStorage = (id: number, nodeList: any[], edgeList: any[], action_type: number) => {
    setUserId(id)
    setNodes(nodeList)
    setEdges(edgeList)
    localStorage.setItem('user_id', id.toString())
    if (action_type !== 0) {
      localStorage.setItem('gallery_user_id', id.toString())
    }
  }

  useForceLayout({ strength, distance, setIsLoading, userId })

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      const newNodeList = nodes.map((_node) => {
        if (_node.id === node.id) {
          const newNode = { ..._node }
          newNode.data = { ...newNode.data, isVisible: true }
          if (node.data.level === 0) {
            newNode.className = styles.node1_center_hover
          } else if (node.data.level === 1) {
            newNode.className = styles.node1_level1_node_hover
          } else if (node.data.level === 2) {
            newNode.className = styles.node1_level2_node_hover
          } else {
            newNode.className = styles.node1_level3_node_hover
          }
          return newNode
        } else {
          const newNode = { ..._node }
          newNode.data = { ...newNode.data, isVisible: false }
          if (newNode.data.level === 0) {
            newNode.className = styles.node1_center
          } else if (newNode.data.level === 1) {
            newNode.className = styles.node1_level1_node
          } else if (newNode.data.level === 2) {
            newNode.className = styles.node1_level2_node
          } else if (newNode.data.level === 3 && newNode.data.is_launched) {
            newNode.className = styles.node1_level3_node_is_launched
          } else {
            newNode.className = styles.node1_level3_node
          }
          return newNode
        }
      })
      setNodes(newNodeList)
    },
    [nodes, edges]
  )

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
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
        {!hasSubmitTally && (
          <TallyPopup
            getPersonData={() => getPersonData(0)}
            setActionType={setActionType}
          />
        )}
        {is_start_project && <TallyStartProject />}
        <Panel position="top-left">
          <div className="flex flex-col items-center gap-3">
            <img src={main_logo} alt="" />
          </div>
        </Panel>
        <Panel position="top-center">
          <TopMenu />
        </Panel>

        <Panel position="bottom-left">
          <CustomZoom />
        </Panel>
        <img src={bg} className="absolute bottom-0 -z-50 w-screen" alt="" />
        {isOpenBrainStormContent && <BrainStormContent />}
        {isOpenGalleryContent && (
          <GalleryContent
            getPersonData={getPersonData}
            setActionType={setActionType}
          />
        )}
        <Cursors cursors={cursors} />
        <MiniMap />
      </ReactFlow>
      <DiscordModal
        isOpen={is_ahead_discord}
        onClose={() => setAheadDiscordStatus(false)}
      />
      {isOpenSettingModal && <SettingModal />}
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
