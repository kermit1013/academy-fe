import { useCallback, useEffect, useState } from 'react'
import ReactFlow, {
  Panel,
  ProOptions,
  ReactFlowProvider,
  NodeOrigin,
  NodeMouseHandler,
  useReactFlow,
  MiniMap,
  useViewport
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
import light_bulb from '../../public/light_bulb.svg'
import setting from '../../public/setting.svg'
import change_think from '../../public/change_think.svg'
import disconnect from '../../public/disconnect.svg'
import prev_button from '../../public/prev_button.svg'
import next_button from '../../public/next_button.svg'
import ThinkContent from '../components/ThinkContent'
import useThinkContent from '../hooks/useThinkContent'
import useReferenceThink from '../hooks/useReferenceThink'
import TallyPopup from '../components/TallyPopup'
import TallyStartProject from '../components/TallyStartProject'

import bg from '../../public/bg.svg'
import SettingModal from '../components/modal/SettingModal'
import Loading from '../components/Loading'
import useStartProject from '../hooks/useStartProject'
import useAheadDiscord from '../hooks/useAheadDiscord'
import DiscordModal from '../components/modal/DiscordModal'
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
  const [nodes, setNodes, onNodesChange] = useNodesStateSynced()
  const [edges, setEdges, onEdgesChange] = useEdgesStateSynced()

  const [cursors, onMouseMove] = useCursorStateSynced()
  const { is_start_project } = useStartProject()
  const { is_ahead_discord, setAheadDiscordStatus } = useAheadDiscord()
  const { setIsContentVisible, isContentVisible } = useThinkContent()
  const { zoomIn, zoomOut } = useReactFlow()
  const { setCanReference, can_reference } =
    useReferenceThink()
  const getViewport = useViewport()
  const [hasSubmitTally, setHasSubmitTally] = useState(true)

  useEffect(() => {
    getPersonData()
  }, [])

  const [isOpenSettingModal, setIsOpenSettingModal] = useState(false)

  const navigate = useNavigate()

  const getPersonData = useCallback(async () => {
    const access_token = localStorage.getItem('access_token')
    if (access_token === null) {
      navigate('/')
      return
    }
    try {
      const result = await axios.get('https://api.loudy.in/api/users/me', {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      })
      const user_id = result.data.id
      setHasSubmitTally(result.data.has_submitted_tally)

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

      setTimeout(() => {
        setNodes(nodeList)
        setEdges(edgeList)

        localStorage.setItem('user_id', user_id)
        localStorage.setItem('user_name', result.data.username)
      }, 1000)
    } catch (error) {
      navigate('/')
    }
  }, [])

  useForceLayout({ strength, distance, setIsLoading })

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

  const handlerContentVisible = () => {
    setIsContentVisible(true)
  }
  const handlerCanReference = () => {
    setCanReference(true)
    localStorage.setItem('reference_user_id', localStorage.getItem('user_id') || '')
  }
  const logoutReferenceThink = () => {
    setCanReference(false)
    if (localStorage.getItem('user_id') != localStorage.getItem('reference_user_id')) {
      getPersonData()
    }
    localStorage.removeItem('reference_user_id')
  }

  const [hoverIndex, setHoverIndex] = useState(-1)
  const selectTypeInHoverIn = (index: number) => {
    setHoverIndex(index)
  }

  const getReferencedUserData = async (prev: boolean) => {
    let url = !prev
      ? 'https://api.loudy.in/api/users/me?user_id=0'
      : 'https://api.loudy.in/api/users/me?user_id=0'
    const access_token = localStorage.getItem('access_token')
    if (access_token === null) {
      navigate('/')
      return
    }
    try {
      const result = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      })

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
              item.data.level == 0 ? result.data.username : item.data.label,
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

      setNodes(nodeList)
      setEdges(edgeList)
      localStorage.setItem('reference_user_id', result.data.user_id)
    } catch (error) {
      navigate('/')
    }
  }

  const handlerSetting = () => {
    setIsOpenSettingModal(true)
  }

  const handlerCloseReferenceThink = () => {
    logoutReferenceThink()
  }

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
        {!hasSubmitTally && <TallyPopup getPersonData={getPersonData} />}
        {is_start_project && <TallyStartProject />}
        <Panel position="top-left">
          <div className="flex flex-col items-center gap-3">
            <img src={main_logo} alt="" />
          </div>
        </Panel>
        <Panel position="top-center">
          <div className="flex gap-3">
            <button
              title="靈感發想"
              className={`relative flex h-10 w-10 items-center justify-center rounded border ${
                isContentVisible
                  ? 'border-[#6CA579] bg-[#6CA579]/20'
                  : 'border-[#7B7C7B] bg-[#7B7C7B]/10 hover:bg-[#7B7C7B]/10'
              }`}
              onMouseEnter={() => selectTypeInHoverIn(0)}
              onMouseLeave={() => setHoverIndex(-1)}
              onClick={handlerContentVisible}
              disabled={can_reference}
            >
              <img src={light_bulb} alt="" />
              {hoverIndex == 0 ? (
                <p className="absolute top-12 flex h-7 w-[68px] items-center justify-center rounded border border-[#7B7C7B]/10 bg-white/20 font-sans text-[13px] text-[#7B7C7B]">
                  靈感發想
                </p>
              ) : (
                <></>
              )}
            </button>
            <button
              title="畫廊漫步"
              className={`relative flex h-10 w-10 items-center justify-center rounded border ${
                can_reference
                  ? 'border-[#6CA579] bg-[#6CA579]/20'
                  : 'border-[#7B7C7B] bg-[#7B7C7B]/10 hover:bg-[#7B7C7B]/10'
              }`}
              onMouseEnter={() => selectTypeInHoverIn(1)}
              onMouseLeave={() => setHoverIndex(-1)}
              onClick={() => handlerCanReference()}
              disabled={isContentVisible}
            >
              <img src={change_think} alt="" />
              {hoverIndex == 1 ? (
                <p className="absolute top-12 flex h-7 w-[68px] items-center justify-center rounded border border-[#7B7C7B]/10 bg-white/20 font-sans text-[13px] text-[#7B7C7B]">
                  畫廊漫步
                </p>
              ) : (
                <></>
              )}
            </button>
            <button
              title="設定"
              className="relative flex h-10 w-10 items-center justify-center rounded border border-[#7B7C7B] bg-[#7B7C7B]/10 hover:bg-[#7B7C7B]/10"
              onMouseEnter={() => selectTypeInHoverIn(3)}
              onMouseLeave={() => setHoverIndex(-1)}
              onClick={() => handlerSetting()}
            >
              <img src={setting} alt="" />
              {hoverIndex == 3 ? (
                <p className="absolute top-12 flex h-7 w-[68px] items-center justify-center rounded border border-[#7B7C7B]/10 bg-white/20 font-sans text-[13px] text-[#7B7C7B]">
                  設定
                </p>
              ) : (
                <></>
              )}
            </button>
          </div>
        </Panel>

        <Panel position="bottom-left">
          <data className="flex items-end justify-center gap-2 rounded-md border border-[#7B7C7B]/20">
            <div className="flex h-7 w-fit items-center justify-center gap-1 rounded-lg bg-[#7B7C7B]/10 text-[#7B7C7B]">
              <button
                className="p-2"
                onClick={() => zoomOut({ duration: 800 })}
              >
                -
              </button>
              <p className="border-l border-r border-[#7B7C7B] px-2">
                {Math.floor(getViewport.zoom * 100)}%
              </p>
              <button className="p-2" onClick={() => zoomIn({ duration: 800 })}>
                +
              </button>
            </div>
          </data>
        </Panel>
        <img src={bg} className="absolute bottom-0 -z-50 w-screen" alt="" />
        {isContentVisible ? <ThinkContent /> : <></>}
        {can_reference ? (
          <div className="flex h-full w-full flex-col items-center justify-center p-4">
            <div className="flex h-full w-full items-center justify-between">
              <button
                onClick={() => getReferencedUserData(true)}
                className="z-10 flex h-10 w-10 items-center justify-center rounded border border-[#7B7C7B] hover:bg-[#7B7C7B]/10"
              >
                <img src={prev_button} alt="" />
              </button>
              <button
                onClick={() => getReferencedUserData(false)}
                className="z-10 flex h-10 w-10 items-center justify-center rounded border border-[#7B7C7B] hover:bg-[#7B7C7B]/10"
              >
                <img src={next_button} alt="" />
              </button>
            </div>
            <div className="z-10 flex h-10 w-fit items-center justify-center rounded border border-[#7B7C7B]/20 bg-[#7B7C7B]/10 px-2 py-1">
              <p className="font-sans text-[13px] text-[#7B7C7B]">
                按左右鍵可以逛逛他人的心智圖
              </p>
              <p className="ml-2 h-full w-1 border-l border-[#7B7C7B]"></p>
              <button
                className="hover:scale-110"
                onClick={handlerCloseReferenceThink}
              >
                <img src={disconnect} alt="" />
              </button>
            </div>
          </div>
        ) : (
          <> </>
        )}
        <Cursors cursors={cursors} />
        <MiniMap />
      </ReactFlow>
      <DiscordModal
        isOpen={is_ahead_discord}
        onClose={() => setAheadDiscordStatus(false)}
      />
      <SettingModal
        isOpen={isOpenSettingModal}
        onClose={() => setIsOpenSettingModal(false)}
      />
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
