import { KeyboardEvent, useCallback, useState } from 'react'
import { Handle, NodeToolbar, Position, useReactFlow } from 'reactflow'
import styles from '../styles.module.css'
import axios from 'axios'
import useNodesStateSynced from '../hooks/useNodesStateSynced'
import useEdgesStateSynced from '../hooks/useEdgesStateSynced'
import { message } from 'antd'
import useBubble from '../hooks/useBubble'
import useReferenceThink from '../hooks/useReferenceThink'
import start_project from '../../public/start_project.svg'
import delete_bubble from '../../public/delete_bubble.svg'
import chat_bubble from '../../public/chat_bubble.svg'

interface props {
  data: {
    id: string
    label: string
    category: string
    isVisible: boolean
    level: number
    is_launched: boolean
  }
}

const Bubble = ({ data }: props) => {
  const { getNodes, getEdges } = useReactFlow()
  const { setSelectBubble } = useBubble()
  const setNodes = useNodesStateSynced()[1]
  const setEdges = useEdgesStateSynced()[1]
  const [modifyData, setModifyData] = useState(data.label)
  const [messageApi, contextHolder] = message.useMessage()
  const { edit_bubble_id, setEditBubbleId } = useBubble()

  const { reference_user_id, can_reference } = useReferenceThink()

  const selectBubble = () => {
    const node = getNodes().filter((node) => node.id === data.id)[0]
    if (node.data.id.includes('level2')) {
      setSelectBubble(node)
    }
  }

  const handlerEdit = () => {
    if (data.category != null && data.category !== 'ABOUT') {
      const node_list = getNodes()
      const edge_list = getEdges()
      const myNodes = node_list.map((node) => {
        return { ...node, selected: false }
      })

      const child_edge_List = edge_list.filter((edge) => edge.source == data.id)
      const myEdgeList = child_edge_List.map((edge) => edge.target)
      const selectedNodes = myNodes.map((node) => {
        if (myEdgeList.includes(node.id)) {
          return { ...node, selected: true }
        } else if (node.id === data.id) {
          return { ...node, selected: true }
        }

        return node
      })

      setNodes(selectedNodes)
    } else {
      setEditBubbleId(data.id)
      setModifyData(data.label)
    }
  }

  const handlerFinishEdit = () => {
    // if (modifyData === '' && edit_bubble_id != '') {
    //   messageApi.warning('不可為空白!')
    //   return
    // }

    setEditBubbleId('')

    if (data.label !== modifyData) {
      handlerEditBubble()
    }
  }

  const handlerRemoveBubble = async () => {
    const edges = getEdges()
    let hasChild = false
    edges.forEach((edge) => {
      if (edge.source === data.id) {
        hasChild = true
        return
      }
    })
    if (hasChild) {
      messageApi.warning('還有下層的bubble不可刪除')
      return
    }
    if (confirm('是否要刪除?')) {
      const origin_id = data.id
      const access_token = localStorage.getItem('access_token')
      const result = await axios.delete(
        `https://api.loudy.in/api/graphs/nodes/${origin_id}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        }
      )
      if (result.status === 204) {
        const nodes = getNodes()
        const edges = getEdges()
        const nodeList = nodes.filter((node) => node.id !== data.id)
        const edgeList = edges.filter((edge) => edge.target !== data.id)
        setNodes(nodeList)
        setEdges(edgeList)
        messageApi.info('已刪除')
      }
    }
  }

  const handlerNewBubble = useCallback(async () => {
    const access_token = localStorage.getItem('access_token')

    const result = await axios.post(
      'https://api.loudy.in/api/graphs/nodes',
      {
        source: parseInt(data.id),
        label: '',
        category: ''
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    )
    if (result.status === 200) {
      const user_id = localStorage.getItem('user_id')
      if (user_id == null) {
        messageApi.warning('取不到使用者id')
      }

      const new_bubble = result.data
      const class_name =
        new_bubble.level === 0
          ? styles.node1_center
          : new_bubble.level === 1
            ? styles.node1_level1_node
            : new_bubble.level === 2
              ? styles.node1_level2_node
              : styles.node1_level3_node
      const childNode = {
        id: `${new_bubble.id}`,
        type: 'bubble',
        position: {
          x: 0,
          y: 0
        },
        data: {
          id: `${new_bubble.id}`,
          label: '',
          category: null,
          isVisible: true,
          level: new_bubble.level,
          is_launched: false
        },
        className: class_name
      }
      const childEdge = {
        id: `${data.id}->${new_bubble.id}`,
        source: `${data.id}`,
        target: `${new_bubble.id}`,
        type: 'straight'
      }
      const nodesList = getNodes().map((node) => {
        if (node.id === data.id) {
          const newNode = { ...node }
          newNode.data = { ...node.data, isVisible: false }

          return newNode
        }
        return node
      })

      const newNodeList = nodesList.concat(childNode)
      setNodes(newNodeList)
      setEdges((eds) => [...eds, childEdge])
      setEditBubbleId(new_bubble.id)
      setModifyData('')
      messageApi.info('已新增')
    }
  }, [])

  const handlerEditBubble = async () => {
    setEditBubbleId('')

    const access_token = localStorage.getItem('access_token')
    const result = await axios.put(
      `https://api.loudy.in/api/graphs/nodes/${data.id}`,
      {
        label: modifyData
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    )

    if (result.status === 200) {
      const nodes = getNodes()
      const newNodeList = nodes.map((node) => {
        if (node.id === data.id) {
          let newNode = { ...node }
          let newNode_data = node.data
          newNode_data.label = modifyData
          newNode.data = newNode_data
          return newNode
        }
        return node
      })
      setNodes(newNodeList)
      setModifyData('')
      messageApi.info('已編輯')
    }
  }

  const handlerKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      if (modifyData === '') {
        messageApi.warning('不可為空白!')
        return
      } else {
        handlerEditBubble()
      }
    }
  }

  const handlerModifyData = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (
      (data.level === 2 && e.target.value.length <= 15) ||
      (data.level === 3 && e.target.value.length <= 18)
    ) {
      setModifyData(e.target.value)
    } else {
      messageApi.warning('已超過可輸入長度!')
    }
  }

  return (
    <div
      className="relative flex h-full w-full items-center justify-center text-center"
      onClick={() => selectBubble()}
      onDoubleClick={() => handlerEdit()}
      onBlur={() => handlerFinishEdit()}
      key={data.id}
    >
      {/* <>
      level0(center): 只能加 
      level1(五個主題外 還可以加沒有category的): 只能加
      level2: 可增加、可刪除
      level3: 只能刪除 
        is_launched(只有level3能true或false)
        is_launched = true 
          - 在畫廊要跳discord頁面
          - 在自已的不可以刪除、要顯示白色背景
        is_launched = false (在畫廊不跳任何東西、如果自已顯示執行計劃)
      </> */}
      {contextHolder}

      {!can_reference && data.level !== 3 && reference_user_id === '' ? (
        <NodeToolbar isVisible={data.isVisible} position={Position.Right}>
          <button
            className="absolute -left-1 -top-3 h-6 w-6 rounded-full border border-[#6CA579] bg-[#6CA579]/20 text-center text-[16px] text-[#6CA579]"
            onClick={() => handlerNewBubble()}
            title="新增泡泡"
          >
            +
          </button>
        </NodeToolbar>
      ) : (
        <></>
      )}
      {!can_reference &&
      (data.level === 2 || (data.level === 3 && data.is_launched === false)) &&
      reference_user_id === '' ? (
        <NodeToolbar isVisible={data.isVisible} position={Position.Left}>
          <button
            className="absolute -left-5 -top-3 flex h-6 w-6 items-center justify-center rounded-full border border-[#6CA579] bg-[#6CA579]/20"
            onClick={() => handlerRemoveBubble()}
            title="刪除泡泡"
          >
            <img src={delete_bubble} alt="" />
          </button>
        </NodeToolbar>
      ) : (
        <></>
      )}
      {can_reference &&
      data.level === 3 &&
      data.is_launched === true &&
      reference_user_id !== '' ? (
        <NodeToolbar isVisible={data.isVisible} position={Position.Right}>
          <button
            className="absolute -left-1 -top-3 flex h-6 w-6 items-center justify-center rounded-full border border-[#6CA579] bg-[#6CA579]/20 text-center text-[16px] text-[#6CA579]"
            title="加入Discord"
          >
            <img src={chat_bubble} alt="" />
          </button>
        </NodeToolbar>
      ) : (
        <></>
      )}
      {!can_reference &&
      data.level === 3 &&
      data.is_launched === false &&
      reference_user_id === '' ? (
        <NodeToolbar isVisible={data.isVisible} position={Position.Right}>
          <button
            className="absolute -left-1 -top-3 flex h-6 w-6 items-center justify-center rounded-full border border-[#6CA579] bg-[#6CA579]/20 text-center text-[16px] text-[#6CA579]"
            title="開始計劃"
          >
            <img src={start_project} alt="" />
          </button>
        </NodeToolbar>
      ) : (
        <></>
      )}
      {!can_reference &&
      ((data.level === 1 && data.category === null) ||
        data.level === 2 ||
        data.level === 3) &&
      data.isVisible == true &&
      reference_user_id === '' &&
      edit_bubble_id == data.id ? (
        <textarea
          className="flex h-full w-full resize-none items-center justify-center rounded-full bg-transparent p-2 text-center font-sans text-sm text-[#6ca579] focus:outline-none"
          value={modifyData}
          autoFocus
          placeholder="請輸入您的想法"
          onChange={(e) => handlerModifyData(e)}
          onKeyDown={(e) => handlerKeyDown(e)}
        />
      ) : (
        <p
          className={`${
            data.isVisible ? 'text-[#6ca579]' : 'text-[#7B7C7B]'
          } font-sans`}
        >
          {data.label}
        </p>
      )}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default Bubble
