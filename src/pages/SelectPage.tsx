import { useCallback, useEffect, useState } from 'react'
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
  const [user_id_list, setUserIdList] = useState<number[]>([])
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

  const navigate = useNavigate()

  const getPersonData = useCallback(async (action_type: number) => {
    console.log(actionType)
    const access_token = localStorage.getItem('access_token')
    if (access_token === null) {
      navigate('/')
      return
    }
    let user_id = 0
    if (action_type == -1) {
      user_id = user_id_list.pop() as number
    }
    const url =
      action_type == -1
        ? `https://api.loudy.in/api/users/me?user_id=${user_id}`
        : action_type == 1
          ? 'https://api.loudy.in/api/users/me?user_id=0'
          : 'https://api.loudy.in/api/users/me'
    try {
      const result = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      })
      if (action_type === 1) {
        setUserIdList((prev) => [...prev, result.data.id])
      } else if (action_type === 0) {
        setHasSubmitTally(result.data.has_submitted_tally)
      }

      const nodeList = result.data.nodes.map((item: InputNode) => {
        const node_class =
          item.data.level == 0
            ? styles.node1_center
            : item.data.level == 1
              ? styles.node1_level1_node
              : item.data.level == 2
                ? styles.node1_level2_node
                : item.data.level == 3 && item.data.is_launched
                  ? styles.node1_level3_node_is_launched
                  : styles.node1_level3_node
        return {
          id: `${item.id}`,
          type: 'bubble',
          position: { x: 0, y: 0 },
          data: {
            id: `${item.id}`,
            label:
              item.data.level == 0
                ? `${result.data.username}`
                : `${item.data.label}`,
            category: item.data.category,
            level: item.data.level,
            is_launched: item.data.is_launched
          },
          className: node_class
        }
      })

      const edgeList = result.data.edges.map((item: InputEdge) => {
        return {
          id: `${item.source}->${item.target}`,
          source: `${item.source}`,
          target: `${item.target}`,
          type: 'straight'
        }
      })

      setUserId(result.data.id)
      setNodes(nodeList)
      setEdges(edgeList)
      localStorage.setItem('user_id', result.data.id)
      if(action_type != 0) {
        localStorage.setItem('gallery_user_id', result.data.id)
      } 
    } catch (error) {
      navigate('/')
    }
  }, [])

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
