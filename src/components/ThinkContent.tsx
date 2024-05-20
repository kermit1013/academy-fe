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
        <div className="border border-white w-[100px] h-[100px] rounded-full text-base p-4 text-center items-center flex justify-center">
          {select_bubble == null ? (
            <div className="text-gray-400">請選擇一顆泡泡</div>
          ) : (
            <div>{select_bubble?.data.label}</div>
          )}
        </div>
        <div className="font-sans font-normal text-3xl">x</div>
        <div className="flex gap-1">
          <div className="border border-white w-[100px] h-[100px] rounded-full text-base p-4 text-center items-center flex justify-center">
            <div>{action_bubble}</div>
          </div>
          <img
            className="hover:cursor-pointer"
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
          <div className="border border-white w-[100px] h-[100px] rounded-[20px] text-base p-4 text-center items-center flex justify-center">
            <div>{action_bubble}</div>
          </div>
          <img
            className="hover:cursor-pointer"
            onClick={() => handler_refresh_api()}
            src={icon_change}
            alt=""
          />
        </div>
        <div className="font-sans font-normal text-3xl">+</div>
        <div className="border border-white w-[100px] h-[100px] rounded-full text-base p-4 text-center items-center flex justify-center">
          {select_bubble == null ? (
            <div className="text-gray-400">請選擇一顆泡泡</div>
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
        <div className="border border-white w-[60px] h-[47px] rounded-full text-base p-3 text-center items-center flex justify-center">
          <div>{setting_bubble}</div>
        </div>
        <div className="font-sans font-normal text-3xl">+</div>
        <div className="border border-white w-[100px] h-[100px] rounded-full text-base p-4 text-center items-center flex justify-center">
          {select_bubble == null ? (
            <div className="text-gray-400">請選擇一顆泡泡</div>
          ) : (
            <div>{select_bubble?.data.label}</div>
          )}
        </div>
        <div className="font-sans font-normal text-3xl">+</div>
        <div className="flex gap-1">
          <div className="border border-white w-[100px] h-[100px] rounded-[20px] text-base p-4 text-center items-center flex justify-center">
            <div>{action_bubble}</div>
          </div>
          <img
            className="hover:cursor-pointer"
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
    <div className="w-full h-full  flex justify-center items-center text-white text-base font-semibold gap-6 pl-16 ">
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
          placeholder="輸入..."
          className="w-[192px] h-[58px] pl-3 bg-white/20 border-2 border-white  text-center  text-base rounded-lg focus:outline-none"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <img src={icon_enter} alt="" />
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
    <div className="w-[800px] h-[240px] p-4 border border-white backdrop-blur-lg flex flex-col rounded-2xl mb-12 z-20 absolute bottom-10 left-1/3">
      <button
        onClick={() => handlerCloseContent()}
        className=" absolute -right-5 -top-5 h-6 w-6 text-sm rounded-full bg-white/30 border border-white hover:bg-white/40"
      >
        x
      </button>
      <div className="w-full h-7 flex justify-between">
        <div className="flex gap-2 text-white text-sm">
          <button
            className={`${
              action_type == 1
                ? 'backdrop-blur-xl  bg-white/20 border border-white'
                : ''
            } py-1 px-[10px] h-7 rounded-full  hover:border  hover:border-white`}
            onClick={() => setActionType(1)}
          >
            瘋狂乘法
          </button>
          <button
            className={`${
              action_type == 2
                ? 'backdrop-blur-xl  bg-white/20 border border-white'
                : ''
            } py-1 px-[10px] h-7 rounded-full  hover:border  hover:border-white`}
            onClick={() => setActionType(2)}
          >
            人物風暴
          </button>
          <button
            className={`${
              action_type == 3
                ? 'backdrop-blur-xl bg-white/20 border border-white'
                : ''
            } py-1 px-[10px] h-7 rounded-full  hover:border  hover:border-white`}
            onClick={() => setActionType(3)}
          >
            情境迷宮
          </button>
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="text-sm text-[#f5c3a5]">1分鐘內寫出5個點子</div>
          <div className="flex gap-1 text-white border border-[#f5c3a5] p-1 rounded-lg w-20 justify-center">
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
