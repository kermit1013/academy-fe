import { message } from 'antd'
import { KeyboardEvent, useCallback, useState } from 'react'
import { Handle, NodeToolbar, Position, useReactFlow } from 'reactflow'
import delete_bubble from '/delete_bubble.svg'
import icon_project from '/icon_project.svg'
import start_project from '/start_project.svg'
import useEdgesStateSynced from '../../hooks/useEdgesStateSynced'
import useNodesStateSynced from '../../hooks/useNodesStateSynced'
import { DeleteBubble, EditBubble, NewBubble } from '../../libs/api/bubble'
import { BubbleProps, createNewBubbleNode } from '../../libs/bubble'
import useBubbleStore from '../../stores/useBubbleStore'
import useEditorStore from '../../stores/useEditorStore'
import useStartProjectStore from '../../stores/useStartProjectStore'
import useTopMenuStore from '../../stores/useTopMenuStore'

const Bubble = ({ data }: BubbleProps) => {
  const { getNodes, getEdges } = useReactFlow()
  const { setSelectBubble } = useBubbleStore()
  const { setStartProjectStatus } = useStartProjectStore()
  const { edit_bubble_id, setEditBubbleId } = useBubbleStore()
  const { isOpenGalleryContent, isOpenBrainStormContent } = useTopMenuStore()
  const { setIsOpen, setEditable, setNodeId } = useEditorStore()
  const [messageApi, contextHolder] = message.useMessage()
  const setNodes = useNodesStateSynced()[1]
  const setEdges = useEdgesStateSynced()[1]
  const [modifyData, setModifyData] = useState(data.label)
  const [isComposing, setIsComposing] = useState(false)

  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  const handleCompositionEnd = () => {
    setIsComposing(false)
  }

  const selectBubble = () => {
    const node = getNodes().filter((node) => node.id === data.id)[0]
    if (node.data.level === 2) {
      setSelectBubble(node)
    }
  }

  const handlerEdit = () => {
    if (isOpenBrainStormContent) {
      return
    }
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
      messageApi.warning('下層尚有泡泡，無法刪除')
      return
    }
    if (confirm('確定要刪除嗎?')) {
      DeleteBubble(data.id)
        .then(() => {
          RenderDeleteBubble()
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })
    }
  }
  const handlerNewBubble = useCallback(async () => {
    NewBubble(data.id, '', '', '')
      .then((result) => {
        const { node: childNode, edge: childEdge } = createNewBubbleNode(
          result,
          data.id
        )
        const nodesList = getNodes().map((node) => {
          if (node.id === data.id) {
            return { ...node, data: { ...node.data, isVisible: false } }
          }
          return node
        })

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
    EditBubble(data.id, modifyData)
      .then(() => {
        RenderEditBubble(data.id)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }

  const RenderDeleteBubble = () => {
    const nodes = getNodes()
    const edges = getEdges()
    const nodeList = nodes.filter((node) => node.id !== data.id)
    const edgeList = edges.filter((edge) => edge.target !== data.id)
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
      (data.level === 2 && e.target.value.length <= 15) ||
      (data.level === 3 && e.target.value.length <= 18)
    ) {
      setModifyData(e.target.value)
    } else {
      messageApi.warning('超過字數限制!')
    }
  }
  const handleOpenProjectEditor = () => {
    setIsOpen(true)
    setEditable(false)
    setNodeId(data.id)
  }

  const renderAddButton = () => {
    if (!isOpenGalleryContent && data.level !== 3 && !isOpenBrainStormContent) {
      return (
        <NodeToolbar isVisible={data.isVisible} position={Position.Right}>
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
      ((data.level === 1 && data.category === null) ||
        data.level === 2 ||
        (data.level === 3 && data.is_launched === false))
    ) {
      return (
        <NodeToolbar isVisible={data.isVisible} position={Position.Left}>
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
      data.level === 3 &&
      data.is_launched === true
    ) {
      return (
        <NodeToolbar isVisible={data.isVisible} position={Position.Right}>
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
      data.level === 3 &&
      data.is_launched === false &&
      data.label !== ''
    ) {
      return (
        <NodeToolbar isVisible={data.isVisible} position={Position.Right}>
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
      ((data.level === 1 && data.category === null) ||
        data.level === 2 ||
        data.level === 3) &&
      data.isVisible == true &&
      edit_bubble_id == data.id

    if (shouldRenderTextarea) {
      return data.level === 3 ? renderProjectThemeInput() : renderThoughtInput()
    } else {
      return (
        <p
          title={data.label.length > 15 ? data.label : ''}
          className={`${data.isVisible ? 'text-[#6ca579]' : 'text-[#7B7C7B]'} font-sans`}
        >
          {data.label}
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
