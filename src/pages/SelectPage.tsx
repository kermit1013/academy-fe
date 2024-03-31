import { useCallback, useEffect, useState } from 'react'
import ReactFlow, {
  Panel,
  ProOptions,
  ReactFlowProvider,
  NodeOrigin,
  NodeMouseHandler,
  useNodesState,
} from 'reactflow'
import 'reactflow/dist/style.css'

import useForceLayout from '../hooks/useForceLayout'

import styles from '../styles.module.css'
import HintToolBox from '../components/HintToolBox'

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
  style: { stroke: 'url(#myEdge)', strokeWidth: 10 },
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

function ReactFlowPro({ strength = -200, distance = 300 }: ExampleProps = {}) {
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
  // const { setProvider } = useYDoc()
  const [cursors, onMouseMove] = useCursorStateSynced()

  const { node_list, edge_list, setNode, setEdge } = useBubble()

  const [times, setTimes] = useState(1)
  const { item_id, source, label } = useSelectHintItem()
  const [isInit, setIsInit] = useState(false)
  const [userName, SetUserName] = useState('')

  const getPersonData = async () => {
    const email = localStorage.getItem('email')
    const result = await axios.get(
      `https://api.loudy.in/api/users/me?email=${email}`
    )
    const user_id = result.data.id
    SetUserName(result.data.username)
    const nodeRealIDList: string[] = []
    const nodeIDList: number[] = []
    const nodeList = result.data.nodes.map((item: InputNode) => {
      const Id =
        item.category === 'ABOUT'
          ? `level0_${item.id}_user${user_id}`
          : item.category === null
          ? `level2_${item.id}_user${user_id}`
          : `level1_${item.id}_user${user_id}`
      const node_class =
        item.category === 'ABOUT'
          ? styles.node1_center
          : item.category === null
          ? styles.node1_level2_node
          : styles.node1_level1_node
      nodeRealIDList.push(Id)
      nodeIDList.push(item.id)
      return {
        id: Id,
        type: 'bubble',
        position: { x: 0, y: 0 },
        data: {
          id: Id,
          label: item.data.label,
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
  const InitBubbles = () => {
    setNodes([])
    setEdges([])
    getPersonData()
    setTimes(1)
  }

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
      const newNode = { ...node }
      newNode.data = { ...newNode.data, isVisible: true }
      const newNodeList = nodes.map((_node) => {
        if (_node.id === node.id) {
          return newNode
        } else {
          return _node
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
      setTimes(0)
      setVisible(true)
    } else {
      window.location.reload()
    }
  }

  useEffect(() => {
    if (!isInit) return
    const user_id = localStorage.getItem('user_id')

    const nl_1 = nodes.map((node) => {
      console.log(node.id)
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
      console.log(node.id)
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
          style: { stroke: 'url(#otherEdge)', strokeWidth: 10 },
        }
        return newEdge
      }
      return edge
    })
    const el_2 = edge_list.map((edge) => {
      if (edge.id.includes(`user${user_id}`)) {
        const newEdge = {
          ...edge,
          style: { stroke: 'url(#otherEdge)', strokeWidth: 10 },
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
    const myNodes = nodes.map((node) => {
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
      className="intersection-flow w-screen h-screen bg-[url('/public/CoralBG.png')] relative"
      defaultEdgeOptions={defaultEdgeOptions}
      defaultViewport={{
        x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
        y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
        zoom: 0,
      }}
    >
      <Panel position="top-left">
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 rounded-full border-2 border-white bg-white/30 flex justify-center items-center">
            <svg
              width="55"
              height="55"
              viewBox="0 0 55 55"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.0417 18.3333C16.0417 12.0051 21.1718 6.875 27.5 6.875C33.8283 6.875 38.9584 12.0051 38.9584 18.3333C38.9584 24.6616 33.8283 29.7917 27.5 29.7917C21.1718 29.7917 16.0417 24.6616 16.0417 18.3333ZM27.5 25.2083C31.297 25.2083 34.375 22.1303 34.375 18.3333C34.375 14.5364 31.297 11.4583 27.5 11.4583C23.7031 11.4583 20.625 14.5364 20.625 18.3333C20.625 22.1303 23.7031 25.2083 27.5 25.2083Z"
                fill="white"
              />
              <path
                d="M14.5364 37.453C11.0982 40.8912 9.16669 45.5544 9.16669 50.4167H13.75C13.75 46.7699 15.1987 43.2726 17.7773 40.6939C20.3559 38.1153 23.8533 36.6667 27.5 36.6667C31.1467 36.6667 34.6441 38.1153 37.2227 40.6939C39.8014 43.2726 41.25 46.7699 41.25 50.4167H45.8334C45.8334 45.5544 43.9018 40.8912 40.4636 37.453C37.0255 34.0149 32.3623 32.0833 27.5 32.0833C22.6377 32.0833 17.9746 34.0149 14.5364 37.453Z"
                fill="white"
              />
            </svg>
          </div>
          <p className="text-white text-2xl font-medium">{userName}</p>
        </div>
      </Panel>
      <Panel position="top-right">
        <button
          className="flex flex-col items-center gap-3"
          onClick={handlerConnect}
        >
          <div className="w-24 h-24 rounded-full border-2 border-white bg-white/30 flex justify-center items-center">
            {!isConnect ? (
              <svg
                width="55"
                height="55"
                viewBox="0 0 55 55"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.16665 43.544H4.58331C4.58331 35.9501 10.7394 29.794 18.3333 29.794C25.9272 29.794 32.0833 35.9501 32.0833 43.544H27.5C27.5 38.4814 23.3959 34.3774 18.3333 34.3774C13.2707 34.3774 9.16665 38.4814 9.16665 43.544ZM42.0841 35.2092L38.8437 31.9688C41.8525 28.9604 43.5428 24.8799 43.5428 20.6251C43.5428 16.3703 41.8525 12.2898 38.8437 9.28131L42.0841 6.04089C50.1373 14.0952 50.1373 27.1526 42.0841 35.2069V35.2092ZM35.601 28.7284L32.3606 25.4834C35.0414 22.7992 35.0414 18.4509 32.3606 15.7667L35.601 12.5194C40.0757 16.9942 40.0757 24.2491 35.601 28.7238V28.7284ZM18.3333 27.5001C13.2707 27.5001 9.16665 23.396 9.16665 18.3334C9.16665 13.2708 13.2707 9.16673 18.3333 9.16673C23.3959 9.16673 27.5 13.2708 27.5 18.3334C27.5 20.7645 26.5342 23.0961 24.8151 24.8152C23.096 26.5343 20.7645 27.5001 18.3333 27.5001ZM18.3333 13.7501C15.8294 13.7526 13.791 15.7641 13.7551 18.2677C13.7192 20.7713 15.6992 22.8404 18.202 22.9147C20.7048 22.989 22.804 21.041 22.9166 18.5396V19.4563V18.3334C22.9166 15.8021 20.8646 13.7501 18.3333 13.7501Z"
                  fill="white"
                />
              </svg>
            ) : (
              <svg
                width="52"
                height="52"
                viewBox="0 0 52 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.9413 18.8108C16.6162 20.7864 15.7641 24.3895 17.7718 27.2801C19.6506 29.985 22.0171 32.3511 24.7215 34.229C27.6121 36.2363 31.2151 35.384 33.1905 33.0588L33.2125 33.069C35.7358 34.2378 38.4158 35.039 41.1667 35.4472V41.1666L41.1643 41.1666L41.1582 41.1666C23.8799 41.1911 10.8149 27.9741 10.8334 10.8411V10.8333H16.552L16.5523 10.8359C16.9607 13.5864 17.7615 16.2642 18.9305 18.7873L18.9413 18.8108ZM41.1643 45.5H43.3333C44.5299 45.5 45.5 44.5299 45.5 43.3333V33.5784C45.5 32.5046 44.7135 31.5928 43.6514 31.4352L41.8007 31.1605C39.4599 30.8132 37.1812 30.1317 35.0339 29.137L33.4027 28.3814C32.4575 27.9435 31.3344 28.2403 30.7289 29.0881L29.9905 30.1219C29.3433 31.028 28.1077 31.3048 27.1931 30.6697C24.9131 29.0865 22.9148 27.0886 21.3309 24.8081C20.6956 23.8934 20.9724 22.6576 21.8786 22.0104L22.912 21.2725C23.7599 20.667 24.0567 19.5438 23.6188 18.5985L22.8623 16.9657C21.8676 14.8187 21.1862 12.5401 20.8387 10.1996L20.5639 8.34851C20.4062 7.28641 19.4945 6.5 18.4207 6.5H8.66669C7.47007 6.5 6.50002 7.47005 6.50002 8.66667V10.8364C6.47896 30.3504 21.4722 45.5279 41.1643 45.5Z"
                  fill="white"
                />
              </svg>
            )}
          </div>
          <p className="text-white text-2xl font-medium">
            {!isConnect ? '連線' : '中斷連線'}
          </p>
        </button>
      </Panel>
      <Panel position="bottom-right">
        <HintToolBox />
      </Panel>
      <Panel position="bottom-left">
        <div className="flex gap-2 text-white items-end h-12 w-[435px] overflow-hidden">
          <button
            className=" h-12 border-2 border-white bg-white/30 rounded-md px-2 py-1 flex-shrink-0"
            onClick={handleSelectAll}
          >
            Select Mine
          </button>
          <button
            hidden={isConnect}
            className="h-12  border-2 border-white bg-white/30 rounded-md px-2 py-1"
            onClick={() => setTimes(1)}
          >
            RunEffect
          </button>
          <button
            hidden={isConnect}
            className="h-12  border-2 border-white bg-white/30 rounded-md px-2 py-1"
            onClick={() => setTimes(0)}
          >
            StopEffect
          </button>
          <button
            className="h-12  border-2 border-white bg-white/30 rounded-md px-2 py-1"
            onClick={() => InitBubbles()}
          >
            ReConnect
          </button>
          <svg className="-z-0">
            <defs>
              <linearGradient
                id="otherEdge"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
                spreadMethod="pad"
              >
                <stop offset="0%" stopColor="#291EA4" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#43B85C" stopOpacity="0.35" />
              </linearGradient>
            </defs>
            <defs>
              <linearGradient
                id="myEdge"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
                spreadMethod="pad"
              >
                <stop offset="0%" stopColor="#FEC0E6" stopOpacity="1" />
                <stop offset="100%" stopColor="#F4DBCC" stopOpacity="1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </Panel>

      {isVisible ? <Modal /> : <></>}
      <Cursors cursors={cursors} />
      <ConnectProcess status={isConnectProcess} />
    </ReactFlow>
  )
}

function ReactFlowWrapper() {
  // 👇 This hook is used to display a leva (https://github.com/pmndrs/leva) control panel for this example.
  // You can safely remove it, if you don't want to use it.

  const levaProps = useControls({
    strength: {
      value: -200,
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
