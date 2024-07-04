import { useState } from 'react'
import { message } from 'antd'
import useThinkContent from '../hooks/useThinkContent'
import useReferenceThink from '../hooks/useReferenceThink'
import light_bulb from '../../public/light_bulb.svg'
import setting from '../../public/setting.svg'
import change_think from '../../public/change_think.svg'
import useTopMenu from '../hooks/useTopMenu'

const TopMenu = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [hoverIndex, setHoverIndex] = useState(-1)
  const {
    isOpenBrainStormContent,
    isOpenGalleryContent,
    setIsOpenBrainStormContent,
    setIsOpenGalleryContent,
    setIsOpenSettingModal
  } = useTopMenu()
  const selectTypeInHoverIn = (index: number) => {
    setHoverIndex(index)
  }

  const handlerChange2BrainStorm = () => {
    if (isOpenGalleryContent) return messageApi.warning('請先離開畫廊漫步')
    setIsOpenBrainStormContent(true)
  }

  const handlerChange2Gallery = () => {
    if (isOpenBrainStormContent) return messageApi.warning('請先離開靈感發想')

    setIsOpenGalleryContent(true)
  }

  const handlerSetting = () => {
    setIsOpenSettingModal(true)
  }

  return (
    <div className="flex gap-3">
      {contextHolder}
      <button
        title="靈感發想"
        className={`relative flex h-10 w-10 items-center justify-center rounded border ${
          isOpenBrainStormContent
            ? 'border-[#6CA579] bg-[#6CA579]/20'
            : 'border-[#7B7C7B] bg-[#7B7C7B]/10 hover:bg-[#7B7C7B]/10'
        }`}
        onMouseEnter={() => selectTypeInHoverIn(0)}
        onMouseLeave={() => setHoverIndex(-1)}
        onClick={handlerChange2BrainStorm}
      >
        <img src={light_bulb} alt="" />
        {hoverIndex == 0 && (
          <p className="absolute top-12 flex h-7 w-[68px] items-center justify-center rounded border border-[#7B7C7B]/10 bg-white/20 font-sans text-[13px] text-[#7B7C7B]">
            靈感發想
          </p>
        )}
      </button>
      <button
        title="畫廊漫步"
        className={`relative flex h-10 w-10 items-center justify-center rounded border ${
          isOpenGalleryContent
            ? 'border-[#6CA579] bg-[#6CA579]/20'
            : 'border-[#7B7C7B] bg-[#7B7C7B]/10 hover:bg-[#7B7C7B]/10'
        }`}
        onMouseEnter={() => selectTypeInHoverIn(1)}
        onMouseLeave={() => setHoverIndex(-1)}
        onClick={() => handlerChange2Gallery()}
      >
        <img src={change_think} alt="" />
        {hoverIndex == 1 && (
          <p className="absolute top-12 flex h-7 w-[68px] items-center justify-center rounded border border-[#7B7C7B]/10 bg-white/20 font-sans text-[13px] text-[#7B7C7B]">
            畫廊漫步
          </p>
        )}
      </button>
      <button
        title="設定"
        className="relative flex h-10 w-10 items-center justify-center rounded border border-[#7B7C7B] bg-[#7B7C7B]/10 hover:bg-[#7B7C7B]/10"
        onMouseEnter={() => selectTypeInHoverIn(3)}
        onMouseLeave={() => setHoverIndex(-1)}
        onClick={() => handlerSetting()}
      >
        <img src={setting} alt="" />
        {hoverIndex == 3 && (
          <p className="absolute top-12 flex h-7 w-[68px] items-center justify-center rounded border border-[#7B7C7B]/10 bg-white/20 font-sans text-[13px] text-[#7B7C7B]">
            設定
          </p>
        )}
      </button>
    </div>
  )
}

export default TopMenu
