import { useCallback, useEffect, useState } from 'react'
import ReactFlow, {
  Panel,
  ProOptions,
  ReactFlowProvider,
  NodeOrigin,
  NodeMouseHandler,
  useNodesState,
  useReactFlow,
  MiniMap,
  useViewport,
} from 'reactflow'
import 'reactflow/dist/style.css'
import useForceLayout from '../hooks/useForceLayout'

import styles from '../styles.module.css'

import Bubble from '../components/Bubble'
import useSelectHintItem from '../hooks/useSelectHintItem'
import axios from 'axios'
import useNodesStateSynced from '../hooks/useNodesStateSynced'
import useEdgesStateSynced from '../hooks/useEdgesStateSynced'
import useCursorStateSynced from '../hooks/useCursorStateSynced'
import useYDoc from '../hooks/useYDoc'
import Modal from '../components/Modal'
import Cursors from '../components/Cursors'
import useBubble from '../hooks/useBubble'
import { useControls } from 'leva'
import { useNavigate } from 'react-router-dom'
import main_logo from '../../public/main_page_logo.svg'
import light_bulb from '../../public/light_bulb.svg'
import chat_bubble from '../../public/chat_bubble.svg'
import setting from '../../public/setting.svg'
import disconnect from '../../public/disconnect.svg'
import ThinkContent from '../components/ThinkContent'
import useThinkContent from '../hooks/useThinkContent'

// import useYDoc from '../hooks/useYDoc'
const proOptions: ProOptions = { account: 'paid-pro', hideAttribution: true }

type ExampleProps = {
  strength?: number
  distance?: number
}
const nodeTypes = {
  bubble: Bubble,
}
const nodeOrigin: NodeOrigin = [0.5, 0.5]

const defaultEdgeOptions = {
  style: { stroke: '#fff', strokeWidth: 2 },
}

interface InputNode {
  id: number
  data: {
    label: string
  }
  category: string
}
interface InputEdge {
  source: number
  target: number
}
interface s {
  status: boolean
}
const ConnectProcess = ({ status }: s) => {
  return status ? (
    <div className="w-screen h-screen bg-[url('/public/CoralBG.png')] relative flex justify-center items-center z-50">
      <div className="w-[946px] h-[91px] rounded-full border-2 border-white text-white flex gap-4 justify-center items-center text-2xl font-bold">
        <svg
          width="55"
          height="55"
          viewBox="0 0 55 55"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.16671 43.544H4.58337C4.58337 35.95 10.7395 29.794 18.3334 29.794C25.9273 29.794 32.0834 35.95 32.0834 43.544H27.5C27.5 38.4813 23.396 34.3773 18.3334 34.3773C13.2708 34.3773 9.16671 38.4813 9.16671 43.544ZM42.0842 35.2092L38.8438 31.9688C41.8525 28.9603 43.5429 24.8798 43.5429 20.625C43.5429 16.3702 41.8525 12.2897 38.8438 9.28125L42.0842 6.04083C50.1374 14.0952 50.1374 27.1526 42.0842 35.2069V35.2092ZM35.6011 28.7283L32.3607 25.4833C35.0415 22.7992 35.0415 18.4508 32.3607 15.7667L35.6011 12.5194C40.0757 16.9941 40.0757 24.249 35.6011 28.7238V28.7283ZM18.3334 27.5C13.2708 27.5 9.16671 23.3959 9.16671 18.3333C9.16671 13.2707 13.2708 9.16667 18.3334 9.16667C23.396 9.16667 27.5 13.2707 27.5 18.3333C27.5 20.7645 26.5343 23.0961 24.8152 24.8151C23.0961 26.5342 20.7645 27.5 18.3334 27.5ZM18.3334 13.75C15.8295 13.7525 13.791 15.764 13.7552 18.2677C13.7193 20.7713 15.6993 22.8404 18.202 22.9146C20.7048 22.9889 22.804 21.0409 22.9167 18.5396V19.4563V18.3333C22.9167 15.802 20.8647 13.75 18.3334 13.75Z"
            fill="white"
          />
        </svg>

        <p>連線中...</p>
      </div>
    </div>
  ) : (
    <></>
  )
}
declare global {
  interface Window {
    Tally: any
  }
}

function ReactFlowPro({ strength = -300, distance = 300 }: ExampleProps = {}) {
  const [nodes, setNodes, onNodesChange] = useNodesStateSynced()
  const [edges, setEdges, onEdgesChange] = useEdgesStateSynced()
  const [myNodeList, setMyNodeList] = useNodesState([])
  const {
    ydoc,
    provider,
    isVisible,
    isConnect,
    isConnectProcess,
    setVisible,
    initProvider,
  } = useYDoc()
  const { setIsContentVisible, isContentVisible } = useThinkContent()
  const { fitView, getNodes, zoomIn, zoomOut } = useReactFlow()
  const getViewport = useViewport()
  // const { setProvider } = useYDoc()

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://tally.so/widgets/embed.js'
    script.onload = () => {
      if (window.Tally) {
        window.Tally.openPopup('n0x5Z6', {
          doNotShowAfterSubmit: true,
          onSubmit: async (payload: any) => {
            const access_token = localStorage.getItem('access_token')
            if (access_token == null) {
              navigate('/')
            }
            const data = JSON.stringify(payload)
            let encoded = encodeURI(data)
            const result = await axios.post(
              'https://api.loudy.in/api/graphs/thoughts',
              {
                data: encoded,
              },
              {
                headers: {
                  Authorization: `Bearer ${access_token}`,
                },
              }
            )
            if (result.data === 200) {
              window.Tally.closePopup('n0x5Z6')
              getPersonData()
            }
          },
        })
      }
    }
    document.body.appendChild(script)

    return () => {
      if (window.Tally) {
        window.Tally.closePopup('n0x5Z6')
      }

      document.body.removeChild(script)
    }
  }, [])

  const [cursors, onMouseMove] = useCursorStateSynced()

  const { node_list, edge_list, setNode, setEdge } = useBubble()

  const [times, setTimes] = useState(1)
  const { item_id, source, label } = useSelectHintItem()
  const [isInit, setIsInit] = useState(false)
  const [userName, SetUserName] = useState('')
  const navigate = useNavigate()
  console.log(userName)
  useEffect(() => {
    getPersonData()
  }, [])

  const getPersonData = async () => {
    const access_token = localStorage.getItem('access_token')
    if (access_token === null) {
      navigate('/')
      return
    }
    const result = await axios.get('https://api.loudy.in/api/users/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    if (result.status === 401) {
      navigate('/')
      return
    }
    const user_id = result.data.id
    SetUserName(result.data.username)

    const nodeRealIDList: string[] = []
    const nodeIDList: number[] = []
    interface nodeLevel {
      Center: number
      Level1: number[]
      Level2: number[]
      Level3: number[]
    }
    const node_level: nodeLevel = {
      Center: 0,
      Level1: [],
      Level2: [],
      Level3: [],
    }
    const getNodeLevel = () => {
      const centerNode = result.data.nodes.filter(
        (item: InputNode) => item.category === 'ABOUT'
      )[0] as InputNode

      node_level.Center = centerNode.id
      result.data.edges.forEach((item: InputEdge) => {
        if (item.source === node_level.Center) {
          node_level.Level1.push(item.target)
        }
      })
      result.data.edges.forEach((item: InputEdge) => {
        if (
          node_level.Level1.includes(item.source) &&
          !node_level.Level2.includes(item.target)
        ) {
          node_level.Level2.push(item.target)
        }
      })
      result.data.edges.forEach((item: InputEdge) => {
        if (
          node_level.Level2.includes(item.source) &&
          !node_level.Level3.includes(item.target)
        ) {
          node_level.Level3.push(item.target)
        }
      })
    }
    getNodeLevel()
    const nodeList = result.data.nodes.map((item: InputNode) => {
      const Id =
        node_level.Center === item.id
          ? `level0_${item.id}_user${user_id}`
          : node_level.Level1.includes(item.id)
          ? `level1_${item.id}_user${user_id}`
          : node_level.Level2.includes(item.id)
          ? `level2_${item.id}_user${user_id}`
          : node_level.Level3.includes(item.id)
          ? `level3_${item.id}_user${user_id}`
          : `level4_${item.id}_user${user_id}`
      const node_class =
        node_level.Center === item.id
          ? styles.node1_center
          : node_level.Level1.includes(item.id)
          ? styles.node1_level1_node
          : node_level.Level2.includes(item.id)
          ? styles.node1_level2_node
          : node_level.Level3.includes(item.id)
          ? styles.node1_level3_node
          : styles.node1_level4_node

      nodeRealIDList.push(Id)
      nodeIDList.push(item.id)
      return {
        id: Id,
        type: 'bubble',
        position: { x: 0, y: 0 },
        data: {
          id: Id,
          label:
            item.category === 'ABOUT' ? result.data.username : item.data.label,
          position: { x: 0, y: 0 },
          category: item.category,
        },
        className: node_class,
      }
    })
    setNodes(nodes.concat(nodeList))
    setMyNodeList(nodeList)
    const edgeList = result.data.edges.map((item: InputEdge) => {
      const source_index = nodeIDList.indexOf(item.source)
      const source = nodeRealIDList[source_index]
      const target_index = nodeIDList.indexOf(item.target)
      const target = nodeRealIDList[target_index]
      return {
        id: `${source}->${target}_user${user_id}`,
        source: source,
        target: target,
        type: 'straight',
      }
    })
    setEdges(edges.concat(edgeList))
    localStorage.setItem('user_id', user_id)
    localStorage.setItem('user_name', result.data.username)
  }

  // const InitBubbles = () => {
  //   setNodes([])
  //   setEdges([])
  //   getPersonData()
  //   setTimes(1)
  // }

  useEffect(() => {
    initProvider()
  }, [])
  useEffect(() => {
    if (isInit) return

    getPersonData()
  }, [ydoc, provider])

  useEffect(() => {
    setIsInit(true)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setTimes(500)
      fitView({ duration: 800, maxZoom: 0.5 })
    }, 3000)
  }, [times])

  useForceLayout({ strength, distance, times })

  // const onPaneClick = useCallback(
  //   (evt: MouseEvent) => {
  //     const position = screenToFlowPosition({ x: evt.clientX, y: evt.clientY })
  //     setNodes((nds) => [
  //       ...nds,
  //       {
  //         id: `${nds.length + 1}`,
  //         position,
  //         data: { label: randomEmoji() },
  //       },
  //     ])
  //   },
  //   [screenToFlowPosition, setNodes]
  // )

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      const newNodeList = nodes.map((_node) => {
        if (_node.id === node.id) {
          const newNode = { ..._node }
          newNode.data = { ...newNode.data, isVisible: true }
          return newNode
        } else {
          const newNode = { ..._node }
          newNode.data = { ...newNode.data, isVisible: false }
          return newNode
        }
      })
      setNodes(newNodeList)
      // if (node.id.includes('level3')) return
      // const childId = node.id.includes('level0')
      //   ? `level1_${nodes.length + 1}`
      //   : node.id.includes('level1')
      //   ? `level2_${nodes.length + 1}`
      //   : `level3_${nodes.length + 1}`
      // const childNode = {
      //   id: childId,
      //   position: { x: node.position.x + 100, y: node.position.y + 100 },
      //   data: { label: randomEmoji() },
      //   className: node.id.includes('level0')
      //     ? styles.level1_node
      //     : node.id.includes('level1')
      //     ? styles.level2_node
      //     : styles.level3_node,
      // }
      // const childEdge = {
      //   id: `${node.id}->${childId}`,
      //   source: node.id,
      //   target: childId,
      //   type: 'straight',
      // }
      // setNodes((nds) => [...nds, childNode])
      // setEdges((eds) => [...eds, childEdge])
    },
    [nodes, edges]
  )

  useEffect(() => {
    if (item_id == -1) return
    if (source == -1) return

    console.log(nodes)
    const source_node = nodes.filter(
      (node) => node.id.split('_')[1] === source.toString()
    )[0]
    if (!source_node) return
    const childId = `level2_${item_id}`
    const childNode = {
      id: childId,
      type: 'bubble',
      position: {
        x: source_node.position.x - 100,
        y: source_node.position.y - 100,
      },
      data: {
        id: childId,
        label: label,
        position: {
          x: source_node.position.x - 100,
          y: source_node.position.y - 100,
        },
      },
      className: styles.level2_node,
    }
    const childEdge = {
      id: `${source_node.id}->${childId}`,
      source: source_node.id,
      target: childId,
      type: 'straight',
    }
    setMyNodeList(nodes.concat(childNode))
    setNodes(nodes.concat(childNode))
    setEdges(edges.concat(childEdge))
  }, [item_id, source, label])

  const handlerConnect = () => {
    if (!isConnect) {
      setVisible(true)
    } else {
      window.location.reload()
    }
  }
  const handlerContentVisible = () => {
    if (!isContentVisible) {
      setIsContentVisible(true)
    } else {
      setIsContentVisible(false)
    }
  }

  useEffect(() => {
    if (!isInit) return
    const user_id = localStorage.getItem('user_id')

    const nl_1 = nodes.map((node) => {
      console.log(node)
      const node_class =
        node.id.includes('level0') && node.id.includes(`user${user_id}`)
          ? styles.node2_center
          : node.id.includes('level1') && node.id.includes(`user${user_id}`)
          ? styles.node2_level2_node
          : node.id.includes('level2') && node.id.includes(`user${user_id}`)
          ? styles.node2_level2_node
          : styles.node2_level3_node
      return {
        ...node,
        position: {
          x: node.position.x - 500,
          y: node.position.y,
        },
        className: node_class,
      }
    })
    const nl_2 = node_list.map((node) => {
      const node_class =
        node.id.includes('level0') && node.id.includes(`user${user_id}`)
          ? styles.node2_center
          : node.id.includes('level1') && node.id.includes(`user${user_id}`)
          ? styles.node2_level2_node
          : node.id.includes('level2') && node.id.includes(`user${user_id}`)
          ? styles.node2_level2_node
          : styles.node2_level3_node
      return {
        ...node,
        position: {
          x: node.position.x + 1500,
          y: node.position.y,
        },
        className: node_class,
      }
    })

    const el_1 = edges.map((edge) => {
      if (edge.id.includes(`user${user_id}`)) {
        const newEdge = {
          ...edge,
          style: { stroke: '#fff', strokeWidth: 2 },
        }
        return newEdge
      }
      return edge
    })
    const el_2 = edge_list.map((edge) => {
      if (edge.id.includes(`user${user_id}`)) {
        const newEdge = {
          ...edge,
          style: { stroke: '#fff', strokeWidth: 2 },
        }
        return newEdge
      }
      return edge
    })
    setNodes(nl_1.concat(nl_2))
    setEdges(el_1.concat(el_2))
  }, [node_list, edge_list, isInit])

  useEffect(() => {
    if (!isInit) return

    setNode(nodes)
    setEdge(edges)
  }, [ydoc, provider, isInit])

  const handleSelectAll = () => {
    const node_list = getNodes()
    const myNodes = node_list.map((node) => {
      return { ...node, selected: false }
    })

    const myNodeIdList = myNodeList.map((node) => node.id)
    const selectedNodes = myNodes.map((node) => {
      if (myNodeIdList.includes(node.id)) {
        return { ...node, selected: true }
      }
      return node
    })

    setNodes(selectedNodes)
  }

  return (
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
      // onPaneClick={onPaneClick}
      nodeOrigin={nodeOrigin}
      zoomOnDoubleClick={false}
      className="intersection-flow w-screen h-screen bg-[url('/public/CoralBG.png')] relative font-serif"
      defaultEdgeOptions={defaultEdgeOptions}
      defaultViewport={{
        x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
        y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
        zoom: 0,
      }}
    >
      <Panel position="top-left">
        <div className="flex flex-col items-center gap-3">
          <img src={main_logo} alt="" />
        </div>
      </Panel>
      <Panel position="top-center">
        <div className="flex gap-3">
          <button
            title="發想互動"
            className="w-10 h-10 rounded hover:bg-white/30 bg-white/20 focus:bg-white/30 focus:border-2 focus:border-white flex items-center justify-center"
            onClick={handlerContentVisible}
          >
            <img src={light_bulb} alt="" />
          </button>
          <button
            title={!isConnect ? '連線' : '停止連線'}
            className="w-10 h-10 rounded hover:bg-white/30 bg-white/20 focus:bg-white/30 focus:border-2 focus:border-white  flex items-center justify-center"
            onClick={handlerConnect}
          >
            {!isConnect ? (
              <img src={chat_bubble} alt="" />
            ) : (
              <img src={disconnect} alt="" />
            )}
          </button>
          <button
            title="設定"
            className="w-10 h-10 rounded hover:bg-white/30 bg-white/20 focus:bg-white/30 focus:border-2 focus:border-white  flex items-center justify-center"
          >
            <img src={setting} alt="" />
          </button>
        </div>
      </Panel>

      <Panel position="bottom-left">
        <div className="bg-white/30 flex gap-1 text-white w-fit rounded-lg items-center justify-center h-7">
          <button className="p-2" onClick={() => zoomOut({ duration: 800 })}>
            -
          </button>
          <p className="border-l border-r border-white px-2">
            {Math.floor(getViewport.zoom * 100)}%
          </p>
          <button className="p-2" onClick={() => zoomIn({ duration: 800 })}>
            +
          </button>
        </div>
      </Panel>
      <Panel position="bottom-center">
        <ThinkContent />
      </Panel>
      <Panel position="bottom-right">
        <div className=" flex gap-2 text-white items-end h-12 overflow-hidden">
          <button
            className=" h-12 border-2 border-white bg-white/30 rounded-md px-2 py-1 flex-shrink-0"
            onClick={handleSelectAll}
          >
            Select Mine
          </button>
        </div>
      </Panel>
      {isVisible ? <Modal /> : <></>}
      <Cursors cursors={cursors} />
      <ConnectProcess status={isConnectProcess} />
      <MiniMap pannable zoomable />
    </ReactFlow>
  )
}

function ReactFlowWrapper() {
  const levaProps = useControls({
    strength: {
      value: -300,
      min: -2000,
      max: 0,
    },
    distance: {
      value: 300,
      min: 0,
      max: 1000,
    },
  })

  return (
    <ReactFlowProvider>
      <ReactFlowPro {...levaProps} />
    </ReactFlowProvider>
  )
}

export default ReactFlowWrapper
