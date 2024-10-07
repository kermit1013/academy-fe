import { message } from 'antd'
import { memo, useCallback, useEffect, useState } from 'react'
import { useReactFlow } from 'reactflow'
import { getNodeClassName } from '../../funcs/utils'
import useEdgesStateSynced from '../../hooks/useEdgesStateSynced'
import useNodesStateSynced from '../../hooks/useNodesStateSynced'
import { SelectRandomContext } from '../../libs/api/brain_storm'
import { NewBubble } from '../../libs/api/bubble'
import { createNewBubbleNode } from '../../libs/bubble'
import useStartProjectStore from '../../stores/useStartProjectStore'
import useTopMenuStore from '../../stores/useTopMenuStore'
import icon_change from '/change.svg'
import icon_clock from '/clock.svg'
import close_btn from '/close_btn.svg'
import icon_enter from '/icons/icon_enter.svg'
import icon_plus from '/icons/icon_plus.svg'

const SETTING_BUBBLE = '如果'

type props = {
  action_type: number
}
type actionBubble = {
  name: string
  label?: string
  description?: string
}

const Thinking = ({ action_type }: props) => {
  const [messageApi, contextHolder] = message.useMessage()
  const { getNodes } = useReactFlow()
  const { setSelectedNode, selectedNode } = useStartProjectStore()
  const access_token = localStorage.getItem('access_token')

  const [action_bubble, setActionBubble] = useState({} as actionBubble)
  const [modifyText, setModifyText] = useState('')
  const [isComposing, setIsComposing] = useState(false)

  const setNodes = useNodesStateSynced()[1]
  const setEdges = useEdgesStateSynced()[1]
  const handlerNewBubble = useCallback(async () => {
    const data = selectedNode?.data
    if (data == null) {
      messageApi.warning('請選擇一顆泡泡後再送出資料!')
      return
    }

    const result = await NewBubble(data.id, modifyText, '', action_bubble.name)
    if (result != null) {
      // const this_bubble = getNodes().filter((node) => node.id === data.id)[0]

      const { node: childNode, edge: childEdge } = createNewBubbleNode(
        result,
        data.id
      )

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
      setModifyText('')
      messageApi.info('已新增')
    }
  }, [selectedNode, modifyText])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModifyText(e.target.value)
  }

  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  const handleCompositionEnd = () => {
    setIsComposing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing) {
      if (modifyText.trim() === '') {
        messageApi.warning('請輸入內容後再送出!')
        return
      }
      if (selectedNode == null) {
        messageApi.warning('請選擇一顆泡泡後再送出資料!')
        return
      }
      handlerNewBubble()
    }
  }
  const renderSelectBubble = () => {
    if (selectedNode == null) {
      return <div className="font-sans text-gray-400">請選擇一顆泡泡</div>
    }
    if (selectedNode.data.level !== 2) {
      messageApi.warning('請點選第三層的泡泡')
      setSelectedNode(null)
      return <div className="font-sans text-gray-400">請選擇一顆泡泡</div>
    }

    return <div className="font-sans">{selectedNode.data.label}</div>
  }

  const ActionType1 = memo(() => {
    return (
      <>
        <div className="flex gap-1">
          <div
            className="tooltip tooltip-bottom flex h-[100px] w-[100px] items-center justify-center rounded-[12px] border-2 border-[#7B7C7B] p-4 text-center font-sans text-base"
            data-tip={action_bubble?.description}
          >
            <div className="font-sans">{action_bubble?.name}</div>
          </div>
          <img
            className="w-8 transition-transform duration-200 ease-in-out hover:scale-150 hover:cursor-pointer"
            onClick={handler_refresh_api}
            src={icon_change}
            alt=""
          />
        </div>
        <div className="font-sans text-3xl font-normal">+</div>
        <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full border-2 border-[#7B7C7B] p-3 text-center text-base">
          {renderSelectBubble()}
        </div>
        <div className="font-sans text-3xl font-normal">=</div>
      </>
    )
  })

  const ActionType2 = memo(() => {
    return (
      <>
        <div className="flex h-[47px] w-[60px] items-center justify-center rounded-[12px] border-2 border-[#7B7C7B] text-center text-base">
          <div className="font-sans">{SETTING_BUBBLE}</div>
        </div>
        <div className="font-sans text-3xl font-normal">+</div>
        <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full border-2 border-[#7B7C7B] p-3 text-center text-base">
          {renderSelectBubble()}
        </div>
        <div className="font-sans text-3xl font-normal">+</div>
        <div className="flex gap-1">
          <div className="flex h-[100px] w-[100px] items-center justify-center rounded-[12px] border-2 border-[#7B7C7B] p-4 text-center text-base">
            <div className="font-sans">{action_bubble?.name}</div>
          </div>
          <img
            className="w-8 transition-transform duration-200 ease-in-out hover:scale-150 hover:cursor-pointer"
            onClick={() => handler_refresh_api()}
            src={icon_change}
            alt=""
          />
        </div>
        <div className="font-sans text-3xl font-normal">=</div>
      </>
    )
  })

  const ActionType3 = memo(() => {
    return (
      <>
        <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full border-2 border-[#7B7C7B] p-4 text-center text-base">
          {renderSelectBubble()}
        </div>
        <img src={icon_plus} alt="" />
        <div className="flex gap-[6px]">
          <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full border-2 border-[#7B7C7B] p-3 text-center text-base">
            <div className="font-sans">{action_bubble?.label}</div>
          </div>
          <img
            className="w-8 transition-transform duration-200 ease-in-out hover:scale-150 hover:cursor-pointer"
            onClick={() => handler_refresh_api()}
            src={icon_change}
            alt=""
          />
        </div>
        <div className="font-sans text-3xl font-normal">=</div>
      </>
    )
  })

  const handler_refresh_api = useCallback(async () => {
    if (!access_token) return

    if (action_type === 3) {
      const node = getNodes().filter((node) => node.data.level === 2)
      const select_random_bubble = node[Math.floor(Math.random() * node.length)]
      setActionBubble(select_random_bubble.data)
    } else {
      const endpoint = action_type === 1 ? 'celebrities' : 'scenarios'
      SelectRandomContext(endpoint)
        .then((result) => {
          setActionBubble(result)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [action_type, access_token, getNodes])

  useEffect(() => {
    handler_refresh_api()
  }, [action_type, handler_refresh_api])

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 pl-10 text-base font-normal text-[#7B7C7B]">
      {contextHolder}
      <div className="flex w-full items-center justify-center gap-6 pt-8">
        {action_type == 1 ? (
          <ActionType1 />
        ) : action_type == 2 ? (
          <ActionType2 />
        ) : action_type == 3 ? (
          <ActionType3 />
        ) : (
          <></>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={modifyText}
            placeholder="輸入聯想到的專案主題…"
            className="h-[58px] w-[192px] rounded-lg border-2 border-[#7B7C7B] bg-white/20 pl-3 text-start font-sans text-base focus:outline-none"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
          />
          <img
            className="w-8 transition-transform duration-200 ease-in-out hover:scale-150 hover:cursor-pointer"
            onClick={() => handlerNewBubble()}
            src={icon_enter}
            alt=""
          />
        </div>
      </div>
      <div className="font-sans text-sm text-[#6ca579]">
        看似奇怪的組合說不定會迸出有趣的專案主題！
      </div>
    </div>
  )
}
type think_done_props = {
  bubbleCount: number
}
const ThinkDone = ({ bubbleCount }: think_done_props) => {
  const { getNodes } = useReactFlow()
  const finishBubbleCount = getNodes().length
  console.log(finishBubbleCount - bubbleCount)
  return (
    <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-[#7B7C7B]">
      <div>
        {' '}
        {finishBubbleCount - bubbleCount >= 3
          ? '太厲害了！你有超出常人的創造力！'
          : '再接再厲！越常發想，你的創造力會越強！'}
      </div>
    </div>
  )
}

const BrainStormContent = memo(() => {
  const { getNodes, getEdges } = useReactFlow()
  const { setSelectedNode, selectedNode } = useStartProjectStore()
  const { setIsOpenBrainStormContent } = useTopMenuStore()
  const setNodes = useNodesStateSynced()[1]
  const setEdges = useEdgesStateSynced()[1]

  const [action_type, setActionType] = useState(1)
  const [times, setTimes] = useState(120)

  const [bubbleCount, setBubbleCount] = useState(0)
  const [showThinkDone, setShowThinkDone] = useState(false)
  useEffect(() => {
    setSelectedNode(null)
  }, [])

  useEffect(() => {
    if (selectedNode != null) {
      setBubbleCount(getNodes().length)
      const t = setInterval(() => {
        setTimes((prev) => {
          if (prev <= 1) {
            clearInterval(t)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => {
        clearInterval(t)
      }
    }
  }, [selectedNode])

  useEffect(() => {
    if (times === 0) {
      setShowThinkDone(true)
      const timer = setTimeout(() => {
        setTimes(120)
        setSelectedNode(null)
        setShowThinkDone(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [times])

  useEffect(() => {
    setSelectedNode(null)
    setTimes(120)
  }, [action_type])
  const handlerCloseContent = () => {
    const RenderNewBubbleList = getNodes().map((node) => {
      const newNode = { ...node }
      newNode.className = getNodeClassName({
        level: newNode.data.level,
        is_launched: newNode.data.is_launched,
        is_visible: false,
        isOpenBrainStormContent: false
      })
      return newNode
    })
    setNodes(RenderNewBubbleList)
    const RenderNewEdgeList = getEdges().map((edge) => {
      const newEdge = { ...edge }
      newEdge.style = { stroke: '#7B7C7B', strokeWidth: 2 }
      return newEdge
    })
    setEdges(RenderNewEdgeList)
    setIsOpenBrainStormContent(false)
  }
  return (
    <div className="absolute bottom-10 left-[calc(50%-412px)] z-20 mb-12 flex h-[240px] w-[800px] flex-col rounded-2xl border-2 border-[#7B7C7B] p-4 backdrop-blur-lg xl:left-[calc(50%-400px)]">
      <button
        onClick={() => handlerCloseContent()}
        className="absolute right-[8px] top-[8px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#7B7C7B] bg-[#7B7C7B]/10 text-sm backdrop-blur-3xl hover:bg-[#7B7C7B]/30"
      >
        <img src={close_btn} alt="" />
      </button>
      <div className="flex h-7 w-full justify-between">
        <div className="flex gap-2 text-sm text-white">
          <button
            className={`${
              action_type == 1 ? 'text-[#6ca579]' : 'text-[#7B7C7B]'
            } h-7 rounded-full px-[10px] py-1 font-sans transition-transform duration-200 ease-in-out hover:scale-125 hover:cursor-pointer`}
            onClick={() => setActionType(1)}
          >
            人物風暴
          </button>
          <button
            className={`${
              action_type == 2 ? 'text-[#6ca579]' : 'text-[#7B7C7B]'
            } h-7 rounded-full px-[10px] py-1 font-sans transition-transform duration-200 ease-in-out hover:scale-125 hover:cursor-pointer`}
            onClick={() => setActionType(2)}
          >
            情境迷宮
          </button>
          <button
            className={`${
              action_type == 3 ? 'text-[#6ca579]' : 'text-[#7B7C7B]'
            } h-7 rounded-full px-[10px] py-1 font-sans transition-transform duration-200 ease-in-out hover:scale-125 hover:cursor-pointer`}
            onClick={() => setActionType(3)}
          >
            瘋狂乘法
          </button>
        </div>
        <div className="mr-6 flex items-center justify-center gap-2 font-sans">
          <div className="text-sm text-[#EF6E52]">2分鐘內寫出5個點子</div>
          <div className="flex w-auto justify-center gap-1 rounded-lg border border-[#EF6E52]/20 bg-[#EF6E52]/20 p-1 text-[#EF6E52]">
            <img src={icon_clock} alt="" />
            <span className="countdown pt-px font-sans text-base">
              <span
                style={
                  { '--value': Math.floor(times / 60) } as React.CSSProperties
                }
              ></span>
              :
              <span
                style={{ '--value': times % 60 } as React.CSSProperties}
              ></span>
            </span>
          </div>
        </div>
      </div>
      <div className="h-full w-full">
        {showThinkDone ? (
          <ThinkDone bubbleCount={bubbleCount} />
        ) : (
          <Thinking action_type={action_type} />
        )}
      </div>
    </div>
  )
})

export default BrainStormContent
