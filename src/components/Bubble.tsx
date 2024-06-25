import { KeyboardEvent, useCallback, useState } from 'react'
import { Handle, NodeToolbar, Position, useReactFlow } from 'reactflow'
import styles from '../styles.module.css'
import axios from 'axios'
import useNodesStateSynced from '../hooks/useNodesStateSynced'
import useEdgesStateSynced from '../hooks/useEdgesStateSynced'
import { message } from 'antd'
import useBubble from '../hooks/useBubble'
import useReferenceThink from '../hooks/useReferenceThink'
import connect_discord from '../../public/connect_discord.svg'
import delete_bubble from '../../public/delete_bubble.svg'

interface props {
  data: {
    id: string
    label: string
    category: string
    isVisible: boolean
    position: {
      x: number
      y: number
    }
  }
}

const Bubble = ({ data }: props) => {
  const { getNodes, getEdges } = useReactFlow()
  const { setSelectBubble } = useBubble()
  const setNodes = useNodesStateSynced()[1]
  const setEdges = useEdgesStateSynced()[1]
  const [modifyData, setModifyData] = useState(data.label)
  const [messageApi, contextHolder] = message.useMessage()

  const { ReferenceUserId } = useReferenceThink()
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
  const { edit_bubble_id, setEditBubbleId } = useBubble()

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
      const origin_id = data.id.split('_')[1]
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
    const origin_id = data.id.split('_')[1]
    const result = await axios.post(
      'https://api.loudy.in/api/graphs/nodes',
      {
        source: parseInt(origin_id),
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
      const this_bubble = getNodes().filter((node) => node.id === data.id)[0]
      const user_id = localStorage.getItem('user_id')
      if (user_id == null) {
        messageApi.warning('取不到使用者id')
        return
      }
      const childId =
        data.category === 'ABOUT'
          ? `level1_${result.data.id}_user${user_id}`
          : data.category === null
            ? `level3_${result.data.id}_user${user_id}`
            : `level2_${result.data.id}_user${user_id}`

      const childNode = {
        id: childId,
        type: 'bubble',
        position: {
          x: this_bubble.position.x * 1.5,
          y: this_bubble.position.y * 1.5
        },
        data: {
          id: childId,
          label: '',
          isVisible: true,
          category: null,
          position: {
            x: this_bubble.position.x * 1.5,
            y: this_bubble.position.y * 1.5
          }
        },
        className:
          data.category === 'ABOUT'
            ? data.id != user_id
              ? styles.node1_level1_node
              : styles.node2_level1_node
            : data.category === null
              ? data.id != user_id
                ? styles.node1_level3_node
                : styles.node2_level3_node
              : data.id != user_id
                ? styles.node1_level2_node
                : styles.node2_level2_node
      }
      const childEdge = {
        id: `${data.id}->${childId}`,
        source: data.id,
        target: childId,
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
      console.log(newNodeList)
      setNodes(newNodeList)
      setEdges((eds) => [...eds, childEdge])
      setEditBubbleId(childId)
      setModifyData('')
      messageApi.info('已新增')
    }
  }, [])

  const handlerEditBubble = async () => {
    setEditBubbleId('')

    const origin_id = data.id.split('_')[1]
    const access_token = localStorage.getItem('access_token')
    const result = await axios.put(
      `https://api.loudy.in/api/graphs/nodes/${origin_id}`,
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
          console.log(newNode)
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
      (data.id.includes('level2') && e.target.value.length <= 15) ||
      (data.id.includes('level3') && e.target.value.length <= 18)
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
      {contextHolder}
      {data.category ? (
        <></>
      ) : ReferenceUserId === '' ? (
        <NodeToolbar isVisible={data.isVisible} position={Position.Left}>
          <button
            className="absolute -left-5 -top-3 flex h-6 w-6 items-center justify-center rounded-full border border-[#6CA579] bg-[#6CA579]/20"
            onClick={() => handlerRemoveBubble()}
          >
            <img src={delete_bubble} alt="" />
          </button>
        </NodeToolbar>
      ) : (
        <></>
      )}
      {data.id.indexOf('level3') ? (
        ReferenceUserId === '' ? (
          <NodeToolbar isVisible={data.isVisible} position={Position.Right}>
            <button
              className="absolute -left-1 -top-3 h-6 w-6 rounded-full border border-[#6CA579] bg-[#6CA579]/20 text-center text-[16px] text-[#6CA579]"
              onClick={() => handlerNewBubble()}
            >
              +
            </button>
          </NodeToolbar>
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
      {ReferenceUserId !== '' ? (
        <NodeToolbar isVisible={data.isVisible} position={Position.Right}>
          <button className="absolute -left-1 -top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/40 text-[16px]">
            <img src={connect_discord} alt="" />
          </button>
        </NodeToolbar>
      ) : (
        <></>
      )}

      {edit_bubble_id == data.id ? (
        data.category == null ? (
          ReferenceUserId === '' ? (
            <textarea
              cols={
                data.id.includes('level2')
                  ? 4
                  : data.id.includes('level3')
                    ? 9
                    : 10
              }
              rows={3}
              className="h-full w-full resize-none rounded-full bg-transparent p-2 text-center font-sans text-sm text-[#6ca579] focus:outline-none"
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
          )
        ) : (
          <p
            className={`${
              data.isVisible ? 'text-[#6ca579]' : 'text-[#7B7C7B]'
            } font-sans`}
          >
            {data.label}
          </p>
        )
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
