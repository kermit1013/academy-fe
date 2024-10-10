import { message } from 'antd'
import { KeyboardEvent, useCallback, useState } from 'react'
import { Handle, NodeToolbar, Position, useReactFlow } from 'reactflow'
import delete_bubble from '/delete_bubble.svg'
import icon_project from '/icon_project.svg'
import start_project from '/start_project.svg'
import { DeleteBubble, EditBubble, NewBubble } from '../../libs/api/bubble'
import { BubbleProps, createNewBubbleNode } from '../../libs/bubble'
import useBubbleStore from '../../stores/useBubbleStore'
import useEditorStore from '../../stores/useEditorStore'
import useStartProjectStore from '../../stores/useStartProjectStore'
import useTopMenuStore from '../../stores/useTopMenuStore'

const Bubble = ({ data: targetNode }: BubbleProps) => {
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow()
  const { setSelectBubble } = useBubbleStore()
  const { setStartProjectStatus } = useStartProjectStore()
  const { edit_bubble_id, setEditBubbleId } = useBubbleStore()
  const { isOpenGalleryContent, isOpenBrainStormContent } = useTopMenuStore()
  const { setIsOpen, setEditable, setNodeId } = useEditorStore()
  const [messageApi, contextHolder] = message.useMessage()
  const [modifyData, setModifyData] = useState(targetNode.label)
  const [isComposing, setIsComposing] = useState(false)

  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  const handleCompositionEnd = () => {
    setIsComposing(false)
  }

  const selectBubble = () => {
    const node = getNodes().filter((node) => node.id === targetNode.id)[0]
    if (node.data.level === 2) {
      setSelectBubble(node)
    }
  }

  const handlerEdit = () => {
    if (isOpenBrainStormContent) {
      return
    }
    if (targetNode.category != null && targetNode.category !== 'ABOUT') {
      const node_list = getNodes()
      const edge_list = getEdges()
      const myNodes = node_list.map((node) => {
        return { ...node, selected: false }
      })

      const child_edge_List = edge_list.filter((edge) => edge.source == targetNode.id)
      const myEdgeList = child_edge_List.map((edge) => edge.target)
      const selectedNodes = myNodes.map((node) => {
        if (myEdgeList.includes(node.id)) {
          return { ...node, selected: true }
        } else if (node.id === targetNode.id) {
          return { ...node, selected: true }
        }

        return node
      })

      setNodes(selectedNodes)
    } else {
      setEditBubbleId(targetNode.id)
      setModifyData(targetNode.label)
    }
  }

  const handlerFinishEdit = () => {
    // if (modifyData === '' && edit_bubble_id != '') {
    //   messageApi.warning('不可為空白!')
    //   return
    // }

    setEditBubbleId('')

    if (targetNode.label !== modifyData) {
      handlerEditBubble()
    }
  }

  const handlerRemoveBubble = async () => {
    const edges = getEdges()
    let hasChild = false
    edges.forEach((edge) => {
      if (edge.source === targetNode.id) {
        hasChild = true
        return
      }
    })
    if (hasChild) {
      messageApi.warning('下層尚有泡泡，無法刪除')
      return
    }
    if (confirm('確定要刪除嗎?')) {
      DeleteBubble(targetNode.id)
        .then(() => {
          RenderDeleteBubble()
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })
    }
  }

  const handlerNewBubble = useCallback(async () => {
    NewBubble(targetNode.id, '', '', '')
      .then((result) => {
        let targetPosition = getNodes().filter((node) => node.id === targetNode.id)[0].position
        const nodesList = getNodes().map((node) => {
          if (node.id === targetNode.id) {
            return { ...node, data: { ...node.data, isVisible: false } }
          }
          return node
        })
        const randomOffset = {
          x: (Math.random() - 0.5) * 500, 
          y: (Math.random() - 0.5) * 500
        }
        
        // Apply the offset to the target position
        const newPosition = {
          x: targetPosition.x + randomOffset.x,
          y: targetPosition.y + randomOffset.y
        }
        const { node: childNode, edge: childEdge } = createNewBubbleNode(
          result,
          targetNode.id,
          newPosition
        )

        const newNodeList = nodesList.concat(childNode)
        setNodes(newNodeList)
        setEdges((eds) => [...eds, childEdge])

        setModifyData('')

        messageApi.info('已新增')
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }, [])

  const handlerEditBubble = async () => {
    setEditBubbleId('')
    EditBubble(targetNode.id, modifyData)
      .then(() => {
        RenderEditBubble(targetNode.id)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }

  const RenderDeleteBubble = () => {
    const nodes = getNodes()
    const edges = getEdges()
    const nodeList = nodes.filter((node) => node.id !== targetNode.id)
    const edgeList = edges.filter((edge) => edge.target !== targetNode.id)
    setNodes(nodeList)
    setEdges(edgeList)
    messageApi.info('已刪除')
  }

  const RenderEditBubble = (data_id: string) => {
    const nodes = getNodes()
    const newNodeList = nodes.map((node) => {
      if (node.id === data_id) {
        const newNode = { ...node }
        const newNode_data = node.data
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

  const handlerKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !isComposing) {
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
      (targetNode.level === 2 && e.target.value.length <= 15) ||
      (targetNode.level === 3 && e.target.value.length <= 18)
    ) {
      setModifyData(e.target.value)
    } else {
      messageApi.warning('超過字數限制!')
    }
  }
  const handleOpenProjectEditor = () => {
    setIsOpen(true)
    setEditable(false)
    setNodeId(targetNode.id)
  }

  const renderAddButton = () => {
    if (!isOpenGalleryContent && targetNode.level !== 3 && !isOpenBrainStormContent) {
      return (
        <NodeToolbar isVisible={targetNode.isVisible} position={Position.Right}>
          <button
            className="absolute -left-1 -top-3 h-6 w-6 rounded-full border border-[#6CA579] bg-[#6CA579]/20 text-center text-[16px] text-[#6CA579]"
            onClick={handlerNewBubble}
            title="新增泡泡"
          >
            +
          </button>
        </NodeToolbar>
      )
    }
  }

  const renderDeleteButton = () => {
    if (
      !isOpenGalleryContent &&
      !isOpenBrainStormContent &&
      ((targetNode.level === 1 && targetNode.category === null) ||
        targetNode.level === 2 ||
        (targetNode.level === 3 && targetNode.is_launched === false))
    ) {
      return (
        <NodeToolbar isVisible={targetNode.isVisible} position={Position.Left}>
          <button
            className="absolute -left-5 -top-3 flex h-6 w-6 items-center justify-center rounded-full border border-[#6CA579] bg-[#6CA579]/20"
            onClick={handlerRemoveBubble}
            title="刪除泡泡"
          >
            <img src={delete_bubble} alt="" />
          </button>
        </NodeToolbar>
      )
    }
  }

  const renderDiscordButton = () => {
    if (
      !isOpenGalleryContent &&
      !isOpenBrainStormContent &&
      targetNode.level === 3 &&
      targetNode.is_launched === true
    ) {
      return (
        <NodeToolbar isVisible={targetNode.isVisible} position={Position.Right}>
          <button
            className="absolute -left-1 -top-3 flex h-6 w-6 items-center justify-center rounded-full border border-[#6CA579] bg-[#6CA579]/20 text-center text-[16px] text-[#6CA579]"
            title="打開專案"
            onClick={handleOpenProjectEditor}
          >
            <img src={icon_project} alt="" />
          </button>
        </NodeToolbar>
      )
    }
  }

  const renderStartProjectButton = () => {
    if (
      !isOpenGalleryContent &&
      !isOpenBrainStormContent &&
      targetNode.level === 3 &&
      targetNode.is_launched === false &&
      targetNode.label !== ''
    ) {
      return (
        <NodeToolbar isVisible={targetNode.isVisible} position={Position.Right}>
          <button
            className="absolute -left-1 -top-3 flex h-6 w-6 items-center justify-center rounded-full border border-[#6CA579] bg-[#6CA579]/20 text-center text-[16px] text-[#6CA579]"
            title="開始計劃"
            onClick={() => setStartProjectStatus(true)}
          >
            <img src={start_project} alt="" />
          </button>
        </NodeToolbar>
      )
    }
  }

  const renderContent = () => {
    const shouldRenderTextarea =
      !isOpenGalleryContent &&
      !isOpenBrainStormContent &&
      ((targetNode.level === 1 && targetNode.category === null) ||
        targetNode.level === 2 ||
        targetNode.level === 3) &&
      targetNode.isVisible == true &&
      edit_bubble_id == targetNode.id

    if (shouldRenderTextarea) {
      return targetNode.level === 3 ? renderProjectThemeInput() : renderThoughtInput()
    } else {
      return (
        <p
          title={targetNode.label.length > 15 ? targetNode.label : ''}
          className={`${targetNode.isVisible ? 'text-[#6ca579]' : 'text-[#7B7C7B]'} font-sans`}
        >
          {targetNode.label}
        </p>
      )
    }
  }

  const renderProjectThemeInput = () => {
    return (
      <textarea
        className="flex h-full w-full resize-none items-center justify-center rounded-full bg-transparent px-4 pt-4 text-center font-sans text-base text-[#6ca579] focus:outline-none"
        value={modifyData}
        autoFocus
        placeholder="聯想到什麼專案主題？"
        onChange={(e) => handlerModifyData(e)}
        onKeyDown={(e) => handlerKeyDown(e)}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
      />
    )
  }

  const renderThoughtInput = () => {
    return (
      <textarea
        className="flex h-full w-full resize-none items-center justify-center rounded-full bg-transparent px-4 pt-2 text-center font-sans text-base text-[#6ca579] focus:outline-none"
        value={modifyData}
        autoFocus
        placeholder="請輸入您的想法"
        onChange={(e) => handlerModifyData(e)}
        onKeyDown={(e) => handlerKeyDown(e)}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
      />
    )
  }

  return (
    <div
      className="relative flex h-full w-full items-center justify-center text-center"
      onClick={selectBubble}
      onTouchStart={selectBubble}
      onDoubleClick={handlerEdit}
      onBlur={handlerFinishEdit}
      key={targetNode.id}
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

      {renderAddButton()}
      {renderDeleteButton()}
      {renderDiscordButton()}
      {renderStartProjectButton()}
      {renderContent()}

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default Bubble
