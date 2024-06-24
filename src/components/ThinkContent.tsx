import { useCallback, useEffect, useState } from 'react'
import icon_clock from '../../public/clock.svg'
import icon_change from '../../public/change.svg'
import icon_enter from '../../public/enter.svg'
import axios from 'axios'
import useBubble from '../hooks/useBubble'
import { useReactFlow } from 'reactflow'
import { message } from 'antd'
import styles from '../styles.module.css'
import useNodesStateSynced from '../hooks/useNodesStateSynced'
import useEdgesStateSynced from '../hooks/useEdgesStateSynced'
import useThinkContent from '../hooks/useThinkContent'
import close_btn from '../../public/close_btn.svg'
import plus_icon from '../../public/plus_icon.svg'
type props = {
  action_type: number
}

const Thinking = ({ action_type }: props) => {
  const setting_bubble = '如果'
  const [action_bubble, setActionBubble] = useState('')
  const access_token = localStorage.getItem('access_token')
  const { select_bubble } = useBubble()
  const { getNodes } = useReactFlow()

  const [messageApi, contextHolder] = message.useMessage()
  const [modifyText, setModifyText] = useState('')

  const setNodes = useNodesStateSynced()[1]
  const setEdges = useEdgesStateSynced()[1]
  const handlerNewBubble = useCallback(async () => {
    const data = select_bubble?.data
    const access_token = localStorage.getItem('access_token')
    const origin_id = data.id.split('_')[1]
    const result = await axios.post(
      'https://api.loudy.in/api/graphs/nodes',
      {
        source: parseInt(origin_id),
        label: modifyText,
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
          label: modifyText,
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
      setNodes(newNodeList)
      setEdges((eds) => [...eds, childEdge])
      setModifyText('')
      messageApi.info('已新增')
    }
  }, [select_bubble, modifyText])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModifyText(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      if (select_bubble == null) {
        messageApi.warning('請選擇一顆泡泡後在送出資料!')
        return
      }
      handlerNewBubble()
    }
  }

  const ActionType1 = () => {
    return (
      <>
        <div className="border-2  border-[#7B7C7B] w-[100px] h-[100px] rounded-full text-base p-4 text-center items-center flex justify-center">
          {select_bubble == null ? (
            <div className="text-gray-400 font-sans">請選擇一顆泡泡</div>
          ) : (
            <div>{select_bubble?.data.label}</div>
          )}
        </div>
        <img src={plus_icon} alt="" />
        <div className="flex gap-[6px]">
          <div className="border-2 border-[#7B7C7B] w-[100px] h-[100px] rounded-full text-base p-3 text-center items-center flex justify-center">
            <div className=" font-sans">{action_bubble}</div>
          </div>
          <img
            className="hover:cursor-pointer w-8 hover:scale-150 transition-transform ease-in-out duration-200"
            onClick={() => handler_refresh_api()}
            src={icon_change}
            alt=""
          />
        </div>
        <div className="font-sans font-normal text-3xl">=</div>
      </>
    )
  }

  const ActionType2 = () => {
    return (
      <>
        <div className="flex gap-1">
          <div className="border-2 border-[#7B7C7B] w-[100px] h-[100px] rounded-[12px] text-base p-4 text-center items-center flex justify-center">
            <div className=" font-sans">{action_bubble}</div>
          </div>
          <img
            className="hover:cursor-pointer w-8 hover:scale-150 transition-transform ease-in-out duration-200"
            onClick={() => handler_refresh_api()}
            src={icon_change}
            alt=""
          />
        </div>
        <div className="font-sans font-normal text-3xl">+</div>
        <div className="border-2 border-[#7B7C7B] w-[100px] h-[100px] rounded-full text-base p-3 text-center items-center flex justify-center">
          {select_bubble == null ? (
            <div className="text-gray-400  font-sans">請選擇一顆泡泡</div>
          ) : (
            <div>{select_bubble?.data.label}</div>
          )}
        </div>
        <div className="font-sans font-normal text-3xl">=</div>
      </>
    )
  }

  const ActionType3 = () => {
    return (
      <>
        <div className="border-2 border-[#7B7C7B] w-[60px] h-[47px] rounded-[12px] text-base text-center items-center flex justify-center">
          <div>{setting_bubble}</div>
        </div>
        <div className="font-sans font-normal text-3xl">+</div>
        <div className="border-2 border-[#7B7C7B] w-[100px] h-[100px] rounded-full text-base p-3 text-center items-center flex justify-center">
          {select_bubble == null ? (
            <div className="text-gray-400  font-sans">請選擇一顆泡泡</div>
          ) : (
            <div>{select_bubble?.data.label}</div>
          )}
        </div>
        <div className="font-sans font-normal text-3xl">+</div>
        <div className="flex gap-1">
          <div className="border-2 border-[#7B7C7B] w-[100px] h-[100px] rounded-[12px] text-base p-4 text-center items-center flex justify-center">
            <div className=" font-sans">{action_bubble}</div>
          </div>
          <img
            className="hover:cursor-pointer w-8 hover:scale-150 transition-transform ease-in-out duration-200"
            onClick={() => handler_refresh_api()}
            src={icon_change}
            alt=""
          />
        </div>
        <div className="font-sans font-normal text-3xl">=</div>
      </>
    )
  }

  const handler_refresh_api = async () => {
    if (action_type === 1) {
      const node = getNodes().filter((node) => node.data.id.includes('level2'))
      const select_random_bubble = node[Math.floor(Math.random() * node.length)]
      setActionBubble(select_random_bubble.data.label)
    } else if (action_type === 2) {
      const result = await axios.get(
        'https://api.loudy.in/api/interactions/celebrities',
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      setActionBubble(result.data.name)
    } else if (action_type === 3) {
      const result = await axios.get(
        'https://api.loudy.in/api/interactions/scenarios',
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      setActionBubble(result.data.name)
    }
  }

  useEffect(() => {
    handler_refresh_api()
  }, [action_type])

  return (
    <div className="w-full h-full  font-normal  flex justify-center items-center text-[#7B7C7B] text-base gap-6 pl-16 ">
      {contextHolder}
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
          placeholder=" 輸入..."
          className="w-[192px] h-[58px] pl-3 bg-white/20 border-2 border-[#7B7C7B]  text-start font-sans text-base rounded-lg focus:outline-none"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <img onClick={() => handlerNewBubble()} src={icon_enter} alt="" />
      </div>
    </div>
  )
}

const ThinkDone = () => {
  return (
    <div className="w-full h-full  flex justify-center items-center text-white text-2xl font-semibold ">
      <div>再接再厲！越常發想，你的創造力會越強！</div>
    </div>
  )
}

const ThinkContent = () => {
  const [action_type, setActionType] = useState(1)
  const [times, setTimes] = useState(60)
  const { setIsContentVisible, timer, setTimer } = useThinkContent()
  const { setSelectBubble, select_bubble } = useBubble()

  useEffect(() => {
    setSelectBubble(null)
  }, [])

  useEffect(() => {
    if (select_bubble != null) {
      const t = setInterval(() => {
        setTimes((prev) => prev - 1)
      }, 1000)
      setTimer(t)
      return () => {
        clearInterval(t)
      }
    }
  }, [select_bubble])

  useEffect(() => {
    if (times === 0) {
      clearInterval(timer!)
      setTimeout(() => {
        setTimes(60)
        setSelectBubble(null)
      }, 3000)
    }
  }, [times])

  useEffect(() => {
    setSelectBubble(null)
    setTimes(60)
  }, [action_type])
  const handlerCloseContent = () => {
    console.log('close')
    setIsContentVisible(false)
  }
  return (
    <div className="w-[800px] h-[240px] p-4 border-2 border-[#7B7C7B] backdrop-blur-lg flex flex-col rounded-2xl mb-12 z-20 absolute bottom-10 left-[calc(50%-400px)]">
      <button
        onClick={() => handlerCloseContent()}
        className=" absolute -right-[14px] -top-[14px] h-6 w-6 text-sm flex justify-center items-center rounded-full bg-[#7B7C7B]/20 border border-[#7B7C7B] hover:bg-[#7B7C7B]/40"
      >
        <img src={close_btn} alt="" />
      </button>
      <div className="w-full h-7 flex justify-between">
        <div className="flex gap-2 text-white text-sm">
          <button
            className={`${
              action_type == 1 ? 'text-[#6ca579]' : 'text-[#7B7C7B]'
            } py-1 px-[10px] h-7 rounded-full font-sans `}
            onClick={() => setActionType(1)}
          >
            瘋狂乘法
          </button>
          <button
            className={`${
              action_type == 2 ? 'text-[#6ca579]' : 'text-[#7B7C7B]'
            } py-1 px-[10px] h-7 rounded-full font-sans `}
            onClick={() => setActionType(2)}
          >
            人物風暴
          </button>
          <button
            className={`${
              action_type == 3 ? 'text-[#6ca579]' : 'text-[#7B7C7B]'
            } py-1 px-[10px] h-7 rounded-full font-sans `}
            onClick={() => setActionType(3)}
          >
            情境迷宮
          </button>
        </div>
        <div className="flex items-center justify-center gap-2 font-sans">
          <div className="text-sm text-[#EF6E52]">1分鐘內寫出5個點子</div>
          <div className="flex gap-1 text-[#EF6E52] border bg-[#EF6E52]/20 border-[#EF6E52]/20 p-1 rounded-lg w-20 justify-center">
            <img src={icon_clock} alt="" />
            <div>0:{times}</div>
          </div>
        </div>
      </div>
      <div className="w-full h-full">
        {times ? <Thinking action_type={action_type} /> : <ThinkDone />}
      </div>
    </div>
  )
}

export default ThinkContent
