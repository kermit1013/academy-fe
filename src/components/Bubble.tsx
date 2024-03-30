import { useState } from 'react'
import { Handle, NodeToolbar, Position, useReactFlow } from 'reactflow'
import styles from '../styles.module.css'
import axios from 'axios'
import useNodesStateSynced from '../hooks/useNodesStateSynced'
import useEdgesStateSynced from '../hooks/useEdgesStateSynced'

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
  const setNodes = useNodesStateSynced()[1]
  const setEdges = useEdgesStateSynced()[1]
  const [modifyData, setModifyData] = useState('')

  const modifyText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModifyData(e.target.value)
  }
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      submitData()
    }
  }
  const submitData = async () => {
    const result = await axios.post('https://api.loudy.in/api/graphs/nodes', {
      user_id: 47,
      source: parseInt(data.id.split('_')[1]),
      label: modifyData,
      category: '',
    })

    if (result.status === 200) {
      const user_id = localStorage.getItem('user_id')
      const childId =
        data.category === 'ABOUT'
          ? `level1_${result.data.id}_${user_id}`
          : data.category === null
          ? `level3_${result.data.id}_${user_id}`
          : `level2_${result.data.id}_${user_id}`
      const childNode = {
        id: childId,
        type: 'bubble',
        position: { x: data.position.x * 1.5, y: data.position.y * 1.5 },
        data: {
          id: childId,
          label: modifyData,
          category: null,
          position: { x: data.position.x * 1.5, y: data.position.y * 1.5 },
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

      setNodes(newNodeList)
      setEdges((eds) => [...eds, childEdge])
      setModifyData('')
    }
  }

  const handleDeleteNode = async () => {
    if (data.category !== null) {
      alert('不可刪除')
      return
    }
    const edges = getEdges()
    edges.forEach((edge) => {
      if (edge.source === data.id) {
        alert('還有下層的bubble不可刪除')
      }
    })

    if (confirm(`是否刪除「${data.label}」?`)) {
      const originId = data.id.split('_')[1]
      const result = await axios.delete(
        `https://api.loudy.in/api/graphs/nodes/${originId}`
      )

      if (result.status === 204) {
        const nodes = getNodes()
        const edges = getEdges()
        const nodeList = nodes.filter((node) => node.id !== data.id)
        const edgeList = edges.filter((edge) => edge.target !== data.id)
        setNodes(nodeList)
        setEdges(edgeList)
      }
    }
  }
  return (
    <div key={data.id}>
      {data.category ? (
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
      </NodeToolbar>

      <div>{data.label}</div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default Bubble
