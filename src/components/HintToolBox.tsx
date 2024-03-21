import { useEffect, useState } from 'react'
import icon_drag from '../../public/icon_drag.svg'

import axios from 'axios'
import { IItem } from '../types/hintList'
import useSelectHintItem from '../hooks/useSelectHintItem'
const HintToolBox = () => {
  const [hintList, setHintList] = useState<IItem[]>([])
  const [isVisible, setIsVisible] = useState(true)
  const [boxClass, setBoxClass] = useState('')
  const { onSelectItem } = useSelectHintItem()
  const [userId, setUserId] = useState(0)

  useEffect(() => {
    const user_id = localStorage.getItem('user_id')
    setUserId(parseInt(user_id!))
    let _list: IItem[] = []
    const api = async () => {
      const result = await axios.get(
        `https://api.loudy.in/api/graphs/thoughts?user_id=${user_id}`
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      _list = result.data.map((item: any, idx: number) => {
        const newItem: IItem = {
          id: idx + 1,
          source: item['source'],
          name: item['label'],
          isSelected: false,
        }
        return newItem
      })
      setHintList(_list)
    }
    api()
  }, [])

  const handlerSelectItem = async (item: IItem) => {
    const result = await axios.post('https://api.loudy.in/api/graphs/nodes', {
      user_id: userId,
      source: item.source,
      label: item.name,
      category: '',
    })
    if (result.status === 200) {
      onSelectItem(result.data.id, result.data.source, result.data.label)
    }
  }

  useEffect(() => {
    if (isVisible) {
      setBoxClass('w-[calc(25vw)] h-[calc(70vh)] relative')
    } else {
      setBoxClass('w-fit h-[calc(70vh)] relative')
    }
  }, [isVisible])
  return (
    <div className={boxClass}>
      {isVisible ? (
        <>
          <button
            className="absolute -top-2 right-2 border-2 border-white z-10 w-12 rounded-lg text-white backdrop-blur-lg"
            onClick={() => setIsVisible(false)}
          >
            -
          </button>
          <div className="w-[calc(25vw)] h-[calc(70vh)] border-2 border-white rounded-[50px] bg-white/20 flex flex-col overflow-hidden backdrop-blur-xl absolute top-0">
            <p className="border border-white h-18 w-full scale-105 text-white text-center items-center text-3xl py-5">
              想法小補帖
            </p>
            <div className="overflow-y-scroll flex flex-col gap-7 pt-8">
              {hintList?.length === 0 ? (
                <></>
              ) : (
                hintList.map((item) => {
                  return item.isSelected ? (
                    <></>
                  ) : (
                    <div
                      key={item.id}
                      className=" border-2 border-white text-xl bg-white/20 text-white py-4 pl-3 rounded-xl ml-6 mr-6 hover:cursor-pointer   hover:border-yellow-300 flex gap-6"
                      onClick={() => handlerSelectItem(item)}
                    >
                      <img src={icon_drag} alt="" />
                      <p>{item.name}</p>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </>
      ) : (
        <button
          onClick={() => setIsVisible(true)}
          className=" absolute top-1/3 right-0 rounded-full border-2 border-white backdrop-blur-lg px-2 py-4"
        >
          <svg
            width="21"
            height="41"
            viewBox="0 0 21 41"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 2L2 39"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M10.5 2L10.5 39"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M19 2L19 39"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

export default HintToolBox
