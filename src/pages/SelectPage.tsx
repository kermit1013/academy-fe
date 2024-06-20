import { useCallback, useEffect, useState } from 'react'
import ReactFlow, {
  Panel,
  ProOptions,
  ReactFlowProvider,
  NodeOrigin,
  NodeMouseHandler,
  // useNodesState,
  // useEdgesState,
  useReactFlow,
  // MiniMap,
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
import { useNavigate } from 'react-router-dom'
import main_logo from '../../public/main_page_logo.svg'
import light_bulb from '../../public/light_bulb.svg'
import chat_bubble from '../../public/chat_bubble.svg'
import setting from '../../public/setting.svg'
import change_think from '../../public/change_think.svg'
import disconnect from '../../public/disconnect.svg'
import prev_button from '../../public/prev_button.svg'
import next_button from '../../public/next_button.svg'
import ThinkContent from '../components/ThinkContent'
import useThinkContent from '../hooks/useThinkContent'
import useReferenceThink from '../hooks/useReferenceThink'
import TallyPopup from '../components/TallyPopup'
import ConnectProcess from '../components/ConnectProcess'
import { googleLogout } from '@react-oauth/google'

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

function ReactFlowPro({ strength = -300, distance = 300 }: ExampleProps = {}) {
  const [nodes, setNodes, onNodesChange] = useNodesStateSynced()
  const [edges, setEdges, onEdgesChange] = useEdgesStateSynced()
  const [cursors, onMouseMove] = useCursorStateSynced()
  // const [myNodeList, setMyNodeList] = useNodesState([])
  // const [myEdgeList, setMyEdgeList] = useEdgesState([])
  const {
    ydoc,
    provider,
    isVisible,
    isConnect,
    isConnectProcess,
    // setVisible,
    initProvider,
  } = useYDoc()
  const { setIsContentVisible, isContentVisible } = useThinkContent()
  const { zoomIn, zoomOut } = useReactFlow()
  const { setReferenceUserId } = useReferenceThink()
  const getViewport = useViewport()
  // const { setProvider } = useYDoc()

  useEffect(() => {
    getPersonData()
    initProvider()
    setIsInit(true)
  }, [])

  const { node_list, edge_list, setNode, setEdge } = useBubble()
  const [isReferenceThinkLoding, setIsReferenceThinkLoding] = useState(false)
  const [times, setTimes] = useState(1)
  const { item_id, source, label } = useSelectHintItem()
  const [isInit, setIsInit] = useState(false)

  const navigate = useNavigate()

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
    console.log(result)
    if (result.status === 401) {
      navigate('/')
      return
    }
    const user_id = result.data.id

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
    console.log(node_level)
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
    setTimeout(() => {
      setNodes(nodeList)
      // setMyNodeList(nodeList)
      setEdges(edgeList)
      // setMyEdgeList(edgeList)

      localStorage.setItem('user_id', user_id)
      localStorage.setItem('user_name', result.data.username)
    }, 1000)
  }

  // const InitBubbles = () => {
  //   setNodes([])
  //   setEdges([])
  //   getPersonData()
  //   setTimes(1)
  // }

  useEffect(() => {
    if (isInit) return

    getPersonData()
  }, [ydoc, provider])

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
  const [canReferenced, setCanReferenced] = useState(false)

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
    // setMyNodeList(nodes.concat(childNode))
    setNodes(nodes.concat(childNode))
    setEdges(edges.concat(childEdge))
  }, [item_id, source, label])

  // const handlerConnect = () => {
  //   logoutReferenceThink()
  //   if (!isConnect) {
  //     setVisible(true)
  //   } else {
  //     window.location.reload()
  //   }
  // }
  const handlerContentVisible = () => {
    logoutReferenceThink()
    setIsContentVisible(true)
  }
  const logoutReferenceThink = () => {
    setCanReferenced(false)
    localStorage.removeItem('reference_user_id')

    setNodes([])
    setEdges([])
    // setMyNodeList([])
    // setMyEdgeList([])
    getPersonData()

    setReferenceUserId('')
    setTimes(0)
  }
  useEffect(() => {
    if (!isInit) return
    const user_id = localStorage.getItem('user_id')

    const nl_1 = nodes.map((node) => {
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

  // const handleSelectAll = () => {
  //   const node_list = getNodes()
  //   const myNodes = node_list.map((node) => {
  //     return { ...node, selected: false }
  //   })
  //   console.log(myEdgeList)
  //   const myNodeIdList = myNodeList.map((node) => node.id)
  //   const selectedNodes = myNodes.map((node) => {
  //     if (myNodeIdList.includes(node.id)) {
  //       return { ...node, selected: true }
  //     }
  //     return node
  //   })

  //   setNodes(selectedNodes)
  // }
  const [hoverIndex, setHoverIndex] = useState(-1)
  const selectTypeInHoverIn = (index: number) => {
    setHoverIndex(index)
  }

  const getReferencedUserData = useCallback(
    async (prev: boolean) => {
      console.log(isReferenceThinkLoding)
      if (isReferenceThinkLoding) return
      setIsReferenceThinkLoding(true)
      const access_token = localStorage.getItem('access_token')
      let url = 'https://api.loudy.in/api/users'
      if (prev) {
        const user_id = localStorage.getItem('reference_user_id')
        if (user_id === null) {
          url = 'https://api.loudy.in/api/users'
        } else {
          url = `https://api.loudy.in/api/users?user_id=28`
        }
      }

      try {
        const result = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
        if (result.status === 200) {
          const reference_user_id = result.data.id
          localStorage.setItem('reference_user_id', reference_user_id)
          setReferenceUserId(reference_user_id.toString())
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
                ? `level0_${item.id}_user${reference_user_id}`
                : node_level.Level1.includes(item.id)
                ? `level1_${item.id}_user${reference_user_id}`
                : node_level.Level2.includes(item.id)
                ? `level2_${item.id}_user${reference_user_id}`
                : node_level.Level3.includes(item.id)
                ? `level3_${item.id}_user${reference_user_id}`
                : `level4_${item.id}_user${reference_user_id}`
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
                  item.category === 'ABOUT'
                    ? result.data.username
                    : item.data.label,
                position: { x: 0, y: 0 },
                category: item.category,
              },
              className: node_class,
            }
          })
          await setNodes(nodeList)
          // await setMyNodeList(nodeList)
          const edgeList = result.data.edges.map((item: InputEdge) => {
            const source_index = nodeIDList.indexOf(item.source)
            const source = nodeRealIDList[source_index]
            const target_index = nodeIDList.indexOf(item.target)
            const target = nodeRealIDList[target_index]
            return {
              id: `${source}->${target}_user${reference_user_id}`,
              source: source,
              target: target,
              type: 'straight',
            }
          })
          await setEdges(edgeList)
          setIsReferenceThinkLoding(false)
        }
      } catch (error) {
        console.log(error)
      }

      setTimes(0)
    },
    [isReferenceThinkLoding]
  )

  const handlerSetting = () => {
    console.log('handlerSetting')
    logoutReferenceThink()
    googleLogout();
    navigate('/')
  }
  const handlerCloseReferenceThink = () => {
    logoutReferenceThink()
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
      className="intersection-flow w-screen h-screen bg-[url('/public/CoralBG.webp')] relative font-serif"
      defaultEdgeOptions={defaultEdgeOptions}
    >
      <TallyPopup />
      <Panel position="top-left">
        <div className="flex flex-col items-center gap-3">
          <img src={main_logo} alt="" />
        </div>
      </Panel>
      <Panel position="top-center">
        <div className="flex gap-3">
          <button
            title="發想互動"
            className="w-10 h-10 rounded hover:bg-white/30 bg-white/20 focus:bg-white/30 focus:border-2 focus:border-white flex items-center justify-center relative"
            onMouseEnter={() => selectTypeInHoverIn(0)}
            onMouseLeave={() => setHoverIndex(-1)}
            onClick={handlerContentVisible}
          >
            <img src={light_bulb} alt="" />
            {hoverIndex == 0 ? (
              <p className=" absolute top-12 w-[76px] h-7 rounded text-white bg-white/20">
                發想互動
              </p>
            ) : (
              <></>
            )}
          </button>
          <button
            title="畫廊漫步"
            className="w-10 h-10 rounded hover:bg-white/30 bg-white/20 focus:bg-white/30 focus:border-2 focus:border-white flex items-center justify-center relative"
            onMouseEnter={() => selectTypeInHoverIn(1)}
            onMouseLeave={() => setHoverIndex(-1)}
            onClick={() => setCanReferenced(true)}
          >
            <img src={change_think} alt="" />
            {hoverIndex == 1 ? (
              <p className=" absolute top-12 w-[76px] h-7 rounded text-white bg-white/20">
                畫廊漫步
              </p>
            ) : (
              <></>
            )}
          </button>
          <button
            title={!isConnect ? '連線' : '停止連線'}
            className="w-10 h-10 rounded hover:bg-white/30 bg-white/10 focus:bg-white/30 focus:border-2 focus:border-white  flex items-center justify-center relative"
            onMouseEnter={() => selectTypeInHoverIn(2)}
            onMouseLeave={() => setHoverIndex(-1)}
            // onClick={handlerConnect}
          >
            {!isConnect ? (
              <img src={chat_bubble} alt="" />
            ) : (
              <img src={disconnect} alt="" />
            )}
            {hoverIndex == 2 ? (
              <p className=" absolute top-12 w-[76px] h-7 rounded text-white bg-white/20">
                {!isConnect ? '敬請期待' : '停止連線'}
              </p>
            ) : (
              <></>
            )}
          </button>
          <button
            title="設定"
            className="w-10 h-10 rounded hover:bg-white/30 bg-white/20 focus:bg-white/30 focus:border-2 focus:border-white  flex items-center justify-center relative"
            onMouseEnter={() => selectTypeInHoverIn(3)}
            onMouseLeave={() => setHoverIndex(-1)}
            onClick={() => handlerSetting()}
          >
            <img src={setting} alt="" />
            {hoverIndex == 3 ? (
              <p className=" absolute top-12 w-[76px] h-7 rounded text-white bg-white/20">
                設定
              </p>
            ) : (
              <></>
            )}
          </button>
        </div>
      </Panel>

      <Panel position="bottom-left">
        <data className="flex justify-center items-end gap-2">
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
          {/* <div className=" flex gap-2 text-white items-end h-12 overflow-hidden">
            <button
              className=" h-12 border-2 border-white bg-white/30 rounded-md px-2 py-1 flex-shrink-0"
              onClick={handleSelectAll}
            >
              Select Mine
            </button>
          </div> */}
        </data>
      </Panel>
      {isVisible ? <Modal /> : <></>}
      {isContentVisible && !isConnect ? <ThinkContent /> : <></>}
      {canReferenced ? (
        <div className="flex w-full h-full p-4 flex-col justify-center items-center">
          <div className="flex w-full h-full justify-between items-center ">
            <button
              onClick={() => getReferencedUserData(true)}
              className=" z-10 w-10 h-10 rounded hover:bg-white/30 bg-white/20 focus:bg-white/30 focus:border-2 focus:border-white flex items-center justify-center"
            >
              <img src={prev_button} alt="" />
            </button>
            <button
              onClick={() => getReferencedUserData(false)}
              className=" z-10 w-10 h-10 rounded hover:bg-white/30 bg-white/20 focus:bg-white/30 focus:border-2 focus:border-white flex items-center justify-center"
            >
              <img src={next_button} alt="" />
            </button>
          </div>
          <div className=" z-10 w-fit h-10 rounded bg-white/20 flex items-center justify-center px-2 py-1">
            <p className="text-white text-[13px]">
              按左右鍵可以逛逛他人的心智圖
            </p>
            <p className="border-l border-white w-1 h-full mx-2"></p>
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
      <ConnectProcess status={isConnectProcess} />
      {/* <MiniMap pannable zoomable /> */}
    </ReactFlow>
  )
}

function ReactFlowWrapper() {
  const levaProps = {
    strength: -300,
    distance: 300,
  }

  return (
    <ReactFlowProvider>
      <ReactFlowPro {...levaProps} />
    </ReactFlowProvider>
  )
}

export default ReactFlowWrapper
