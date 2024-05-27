import { KeyboardEvent, useCallback, useState } from 'react'
import { Handle, NodeToolbar, Position, useReactFlow } from 'reactflow'
import styles from '../styles.module.css'
import axios from 'axios'
import useNodesStateSynced from '../hooks/useNodesStateSynced'
import useEdgesStateSynced from '../hooks/useEdgesStateSynced'
import { message } from 'antd'
import useBubble from '../hooks/useBubble'

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

  const canEditButtonWhenReference = localStorage.getItem('reference_user_id')

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
            Authorization: `Bearer ${access_token}`,
          },
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
        category: '',
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
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
          y: this_bubble.position.y * 1.5,
        },
        data: {
          id: childId,
          label: '',
          isVisible: true,
          category: null,
          position: {
            x: this_bubble.position.x * 1.5,
            y: this_bubble.position.y * 1.5,
          },
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
            : styles.node2_level2_node,
      }
      const childEdge = {
        id: `${data.id}->${childId}`,
        source: data.id,
        target: childId,
        type: 'straight',
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
        label: modifyData,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
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

  return (
    <div
      className="w-full h-full text-center flex items-center justify-center overflow-hidden relative"
      onClick={() => selectBubble()}
      onDoubleClick={() => handlerEdit()}
      onBlur={() => handlerFinishEdit()}
      key={data.id}
    >
      {contextHolder}
      {/* {data.category ? (
        <></>
      ) : (
        <div>
          <NodeToolbar
            offset={
              data.id.includes('level0')
                ? -30
                : data.id.includes('level0')
                ? -20
                : -25
            }
            align="end"
            isVisible={data.isVisible}
            position={Position.Top}
          >
            <button
              onClick={handleDeleteNode}
              className="z-50 h-8 w-8 rounded-full border-2 border-black scale-75 bg-white hover:bg-gray-300"
            >
              x
            </button>
          </NodeToolbar>
        </div>
      )}
      <NodeToolbar isVisible={data.isVisible} position={Position.Bottom}>
        {data.id.includes('level3') ? (
          <></>
        ) : (
          <div className="w-40 flex gap-2">
            <input
              autoFocus
              className="rounded-lg w-36 border border-black pl-2"
              type="text"
              value={modifyData}
              onChange={(e) => modifyText(e)}
              onKeyDown={(e) => onKeyDown(e)}
            />
            <button
              className="hover:bg-white/70 border border-black rounded-lg bg-white/50 px-4 py-1"
              onClick={submitData}
            >
              Enter
            </button>
          </div>
        )}
      </NodeToolbar> */}
      {data.category || canEditButtonWhenReference !== '' ? (
        <></>
      ) : (
        <NodeToolbar isVisible={data.isVisible} position={Position.Left}>
          <button
            className=" bg-white/40 w-6 h-6 rounded-full absolute -top-3 -left-5 flex items-center justify-center"
            onClick={() => handlerRemoveBubble()}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.82667 5.99986L9.596 11.9999M6.404 11.9999L6.17333 5.99986M12.8187 3.85986C13.0467 3.89453 13.2733 3.93119 13.5 3.97053M12.8187 3.86053L12.1067 13.1152C12.0776 13.492 11.9074 13.844 11.63 14.1007C11.3527 14.3574 10.9886 14.5 10.6107 14.4999H5.38933C5.0114 14.5 4.64735 14.3574 4.36999 14.1007C4.09262 13.844 3.92239 13.492 3.89333 13.1152L3.18133 3.85986M12.8187 3.85986C12.0492 3.74354 11.2758 3.65526 10.5 3.59519M2.5 3.96986C2.72667 3.93053 2.95333 3.89386 3.18133 3.85986M3.18133 3.85986C3.95076 3.74354 4.72416 3.65526 5.5 3.59519M10.5 3.59519V2.98453C10.5 2.19786 9.89333 1.54186 9.10667 1.51719C8.36908 1.49362 7.63092 1.49362 6.89333 1.51719C6.10667 1.54186 5.5 2.19853 5.5 2.98453V3.59519M10.5 3.59519C8.83581 3.46658 7.16419 3.46658 5.5 3.59519"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </NodeToolbar>
      )}
      {data.id.indexOf('level3') ? (
        <NodeToolbar isVisible={data.isVisible} position={Position.Right}>
          <button
            className=" bg-white/40 w-6 h-6 text-[16px] text-white rounded-full absolute -top-3 -left-1"
            onClick={() => handlerNewBubble()}
          >
            +
          </button>
        </NodeToolbar>
      ) : (
        <></>
      )}

      {edit_bubble_id == data.id ? (
        data.category == null ? (
          <textarea
            maxLength={20}
            className="  bg-transparent h-full w-full p-2 text-white text-sm text-center focus:outline-none "
            value={modifyData}
            autoFocus
            placeholder="請輸入您的想法"
            onChange={(e) => setModifyData(e.target.value)}
            onKeyDown={(e) => handlerKeyDown(e)}
          />
        ) : (
          <div>{data.label}</div>
        )
      ) : (
        <div>{data.label}</div>
      )}

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default Bubble
