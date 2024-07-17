import { useCallback, useEffect, useState } from 'react'
import main_logo from '../../public/groundi_logo.svg'
import text_logo from '../../public/groundi_text.svg'
import light_bulb from '../../public/light_bulb.svg'
import setting from '../../public/setting.svg'
import change_think from '../../public/change_think.svg'
import icon_discord from '../../public/discord.svg'
import start_project from '../../public/pencil-square.svg'
import self_explore from '../../public/puzzle.svg'
import hashtag from '../../public/icons/icon_hashtag.svg'
import gallery from '../../public/icons/icon_gallery.svg'
import { message } from 'antd'

import useTopMenu from '../hooks/useTopMenu'
import useAheadDiscord from '../hooks/useAheadDiscord'
import Editor from './Editor'
import axios from 'axios'
import ProjectWall from './ProjectWall'

interface Project {
  id: string | number
  name: string
  description: string
}

const NavDrawer = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const { setAheadDiscordStatus } = useAheadDiscord()
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isProjectWallOpen, setIsProjectWallOpen] = useState(false)
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState({} as Project)
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
  useEffect(() => {
    getProjects()
  }, [])

  const getProjects = useCallback(async () => {
    const access_token = localStorage.getItem('access_token')
    if (!access_token) {
      return
    }
    const url = 'https://api.loudy.in/api/projects/me'
    try {
      const result = await axios.get(url, {
        headers: { Authorization: `Bearer ${access_token}` }
      })
      if (result.status === 200) {
        setProjects(result.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }, [])
  const handleProjectClick = (project: Project) => {
    console.log(project)
    setSelectedProject(project)
    setIsEditorOpen(true)
  }

  const [isExpanded, setIsExpanded] = useState(false)

  const menuItems = [
    {
      icon: <img src={self_explore} alt="" />,
      label: '自我探索',
      prompt: '從自身出發找尋專案點子',
      onClick: handlerTallyPopup
    },
    {
      icon: <img src={light_bulb} alt="" />,
      label: '靈感發想',
      prompt: '從破碎的靈感中，拼出有趣的專案主題',
      onClick: handlerChange2BrainStorm
    },
    {
      icon: <img src={change_think} alt="" />,
      label: '畫廊漫步',
      prompt: '逛逛他人的心智圖',
      onClick: handlerChange2Gallery
    }
  ]

  const actionItems =[
    {
      icon: <img src={start_project} alt="" />,
      label: '開始計畫',
      prompt: '心智圖可以新增方形的專案主題，請選擇一個方形主題開始計畫',
      onClick: () => setIsEditorOpen(true)
    },
    {
      icon: <img src={icon_discord} alt="" />,
      label: '專案社群',
      prompt: '在 Discord 中交流專案想法。若你的計畫通過審核，還有專屬頻道',
      onClick: handlerAheadDiscordStatus
    },
    {
      icon: <img src={gallery} alt="" />,
      label: '專案瀏覽',
      prompt: '來看看其他人的專案記錄吧',
      onClick: () => setIsProjectWallOpen(true)
    }
  ]

  const projectItems = projects.map((project: Project) => ({
    icon: <img src={hashtag} alt="" />,
    label: project.name,
    prompt: project.description,
    onClick: () => handleProjectClick(project)
  }))


  return (
    <>
      {contextHolder}
      <Editor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        project={selectedProject}
        isEditable={true}
      />

      <ViewOtherUserFrame
        isExpanded={isExpanded}
        isOpenGalleryContent={isOpenGalleryContent}
      ></ViewOtherUserFrame>
      <ProjectWall
        isOpen={isProjectWallOpen}
        onClose={() => setIsProjectWallOpen(false)}
      />
      <div
        className={`fixed left-0 top-0 flex h-full flex-col border-r border-gray-200 bg-gray-50 bg-opacity-30 shadow-lg transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-48' : 'w-22'
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="flex-grow p-4">
          <div
            className={`mb-6 flex items-center ${!isExpanded && 'justify-center'}`}
          >
            <img src={main_logo} alt="Groundi" className="h-6 w-6" />
            <img
              src={text_logo}
              alt="Groundi"
              className={`h-6 pl-2 ${isExpanded ? 'block' : 'hidden'}`}
            />
          </div>
          <div
            className={`mb-4 font-sans text-xs font-medium text-[#6CA579] ${isExpanded ? 'block' : 'text-center'}`}
          >
            發想主題
          </div>
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`group mb-4 flex cursor-pointer items-center ${!isExpanded && 'justify-center'}`}
            >
              <div
                className="tooltip tooltip-right flex font-sans"
                data-tip={item.prompt}
                onClick={item.onClick}
              >
                <span className="text-2xl text-gray-400 group-hover:text-[#6CA579]">
                  {item.icon}
                </span>
                <span
                  className={`ml-3 flex items-center font-sans text-sm text-gray-600 group-hover:text-[#6CA579] ${isExpanded ? 'block' : 'hidden'}`}
                >
                  {item.label}
                </span>
              </div>
            </div>
          ))}
          <div className="my-4 border-t border-gray-200"></div>
          <div
            className={`mb-4 font-sans text-xs font-medium text-[#6CA579] ${isExpanded ? 'block' : 'text-center'}`}
          >
            執行計畫
          </div>
          {actionItems.map((item, index) => (
            <div
              key={index}
              className={`group mb-4 flex cursor-pointer items-center ${!isExpanded && 'justify-center'}`}
            >
              <div
                className="tooltip tooltip-right flex font-sans"
                data-tip={item.prompt}
                onClick={item.onClick}
              >
                <span className="text-2xl text-gray-400 group-hover:text-[#6CA579]">
                  {item.icon}
                </span>
                <span
                  className={`ml-3 flex items-center font-sans text-sm text-gray-600 group-hover:text-[#6CA579] ${isExpanded ? 'block' : 'hidden'}`}
                >
                  {item.label}
                </span>
              </div>
            </div>
          ))}
                    <div className="my-4 border-t border-gray-200"></div>
          <div
            className={`mb-4 font-sans text-xs font-medium text-[#6CA579] ${isExpanded ? 'block' : 'text-center'}`}
          >
            我的專案
          </div>
          {projectItems.map((item, index) => (
            <div
              key={index}
              className={`group mb-4 flex cursor-pointer items-center ${!isExpanded && 'justify-center'}`}
            >
              <div
                className="tooltip tooltip-right flex font-sans"
                data-tip={item.prompt}
                onClick={item.onClick}
              >
                <span className="text-2xl text-gray-400 group-hover:text-[#6CA579]">
                  {item.icon}
                </span>
                <span
                  className={`ml-3 flex items-center font-sans text-sm text-gray-600 group-hover:text-[#6CA579] ${isExpanded ? 'block' : 'hidden'}`}
                >
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className={`p-4 ${isExpanded ? 'pl-4' : 'text-center'}`}>
          <div
            className={`group flex cursor-pointer items-center ${!isExpanded && 'justify-center'}`}
          >
            <div className="flex" onClick={handlerSetting}>
              <img src={setting} alt="" />
              <span
                className={`ml-3 font-sans text-sm text-gray-600 group-hover:text-green-600 ${isExpanded ? 'inline' : 'hidden'}`}
                onClick={handlerSetting}
              >
                個人設定
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

interface UserFrame {
  isOpenGalleryContent: boolean
  isExpanded: boolean
}
const ViewOtherUserFrame = ({
  isOpenGalleryContent,
  isExpanded
}: UserFrame) => {
  return (
    isOpenGalleryContent && (
      <>
        <div
          className={`${isExpanded ? 'left-[177px] w-[calc(100vw-177px)]' : 'left-[65px] w-[calc(100vw-65px)]'} absolute -top-[15px] -z-50 h-2 bg-[#EF6E52]`}
        ></div>
        <div
          className={`${isExpanded ? 'left-[177px]' : 'left-[65px]'} absolute -top-[15px] -z-50 h-screen w-2 bg-[#EF6E52]`}
        ></div>
        <div
          className={`${isExpanded ? 'left-[177px] w-[calc(100vw-177px)]' : 'left-[65px] w-[calc(100vw-65px)]'} absolute -bottom-[calc(100vh-15px)] -z-50 h-2 bg-[#EF6E52]`}
        ></div>
        <div className="absolute -top-[15px] right-[calc(-100vw+15px)] -z-50 h-screen w-2 bg-[#EF6E52]"></div>{' '}
      </>
    )
  )
}

export default NavDrawer
