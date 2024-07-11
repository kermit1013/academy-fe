import { useState } from 'react';
import main_logo from '../../public/groundi_logo.svg'
import text_logo from '../../public/groundi_text.svg'
import light_bulb from '../../public/light_bulb.svg'
import setting from '../../public/setting.svg'
import change_think from '../../public/change_think.svg'
import icon_discord from '../../public/discord.svg'
import start_project from '../../public/pencil-square.svg'
import self_explore from '../../public/puzzle.svg'
import { message } from 'antd'

import useTopMenu from '../hooks/useTopMenu'
import useAheadDiscord from '../hooks/useAheadDiscord'


const NavDrawer = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const { setAheadDiscordStatus } = useAheadDiscord()
  const {
    isOpenBrainStormContent,
    isOpenGalleryContent,
    setIsOpenBrainStormContent,
    setIsOpenGalleryContent,
    setIsOpenSettingModal,
    setIsOpenTallyPopup
  } = useTopMenu()

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

  const handlerAheadDiscordStatus = () => {
    setAheadDiscordStatus(true)
  }

  const handlerTallyPopup = () => {
    setIsOpenTallyPopup(true)
  }

  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { icon: <img src={self_explore} alt="" />, label: '自我探索', prompt: '從自身出發找尋專案點子', onClick: handlerTallyPopup },
    { icon: <img src={light_bulb} alt="" />, label: '靈感發想', prompt: '從破碎的靈感中，拼出有趣的專案主題', onClick: handlerChange2BrainStorm },
    { icon: <img src={change_think} alt="" />, label: '畫廊漫步', prompt: '逛逛他人的心智圖', onClick: handlerChange2Gallery },
  ];

  const actionItems = [
    { icon: <img src={start_project} alt="" />, label: '開始計畫' , prompt: '心智圖可以新增方形的專案主題，請選擇一個方形主題開始計畫'},
    { icon: <img src={icon_discord} alt="" />, label: '專案社群', prompt: '在 Discord 中交流專案想法。若你的計畫通過審核，還有專屬頻道', onClick: handlerAheadDiscordStatus },
  ];

  return (
    <>
      {contextHolder}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-50 border-r border-gray-200 bg-opacity-30 shadow-lg transition-all duration-300 ease-in-out flex flex-col ${isExpanded ? 'w-48' : 'w-22'
          }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="p-4 flex-grow">
          <div className={`flex items-center mb-6 ${!isExpanded && 'justify-center'}`}>
            <img src={main_logo} alt="Groundi" className="w-6 h-6" />
            <img src={text_logo} alt="Groundi" className={`h-6 pl-2 ${isExpanded ? 'block' : 'hidden'}`} />
          </div>
          <div className={`text-[#6CA579] font-sans text-xs font-medium mb-4 ${isExpanded ? 'block' : 'text-center'}`}>發想主題</div>
          {menuItems.map((item, index) => (
            <div key={index} className={`flex items-center mb-4 cursor-pointer group ${!isExpanded && 'justify-center'}`}>
              <div className="flex tooltip tooltip-right font-sans" data-tip={item.prompt} onClick={item.onClick}>
                <span className="text-2xl text-gray-400 group-hover:text-[#6CA579]">{item.icon}</span>
                <span className={`ml-3 text-gray-600 text-sm font-sans group-hover:text-[#6CA579] ${isExpanded ? 'block' : 'hidden'}`}>
                  {item.label}
                </span>
              </div>
            </div>
          ))}
          <div className="border-t border-gray-200 my-4"></div>
          <div className={`text-[#6CA579] text-xs font-sans font-medium mb-4 ${isExpanded ? 'block' : 'text-center'}`}>執行計畫</div>
          {actionItems.map((item, index) => (
            <div key={index} className={`flex items-center mb-4 cursor-pointer group ${!isExpanded && 'justify-center'}`}>
              <div className="flex tooltip tooltip-right font-sans" data-tip={item.prompt} onClick={item.onClick}>
                <span className="text-2xl text-gray-400 group-hover:text-[#6CA579]">{item.icon}</span>
                <span className={`ml-3 text-gray-600 text-sm font-sans group-hover:text-[#6CA579] ${isExpanded ? 'block' : 'hidden'}`}>
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className={`p-4 ${isExpanded ? 'pl-4' : 'text-center'}`}>
          <div className={`cursor-pointer group flex items-center ${!isExpanded && 'justify-center'}`}>
            <img src={setting} alt="" />
            <span className={`ml-3 text-gray-600 text-sm font-sans group-hover:text-green-600 ${isExpanded ? 'inline' : 'hidden'}`}
              onClick={handlerSetting}>
              個人設定
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavDrawer;