import { useCallback, useEffect, useState } from 'react'
import main_logo from '/nav_icons/logo.svg'
import text_logo from '/groundi_text.svg'
import setting from '/setting.svg'
import icon_discord from '/discord.svg'
import wavingHand from '/nav_icons/waving_hand.svg'
import jamJar from '/nav_icons/jam_jar.svg'
import idea from '/nav_icons/idea.svg'
import rocket from '/nav_icons/rocket.svg'
import dashboard from '/nav_icons/dashboard.svg'
import file from '/nav_icons/file.svg'
import delete_project from '/nav_icons/delete.svg'
import { message } from 'antd'

import useTopMenu from '../hooks/useTopMenu'
import useAheadDiscord from '../hooks/useAheadDiscord'
import Editor from './Editor'
import axios from 'axios'
import ProjectWall from './ProjectWall'
import useStartProject from '../hooks/useStartProject'
import useEditor from '../hooks/useEditor'

interface Project {
  id: string | number
  name: string
  description: string
}

const NavDrawer = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const { setAheadDiscordStatus } = useAheadDiscord()

  const [isProjectWallOpen, setIsProjectWallOpen] = useState(false)
  const [projects, setProjects] = useState([])
  const { isOpen, setIsOpen, projectId, setProjectId, setEditable, nodeId } =
    useEditor()

  const {
    isOpenBrainStormContent,
    isOpenGalleryContent,
    setIsOpenBrainStormContent,
    setIsOpenGalleryContent,
    setIsOpenSettingModal,
    setIsOpenTallyPopup
  } = useTopMenu()

  const { selectedNode, setStartProjectStatus } = useStartProject()

  const handleProjectDelete = async (projectId: string | number) => {
    const access_token = localStorage.getItem('access_token')
    if (!access_token) return
    if (confirm('確定刪除該專案嗎？') === false) return

    try {
      await axios.delete(`https://api.loudy.in/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${access_token}` }
      })
      setProjects(
        projects.filter((project: Project) => project.id !== projectId)
      )
      messageApi.success('專案刪除成功！')
    } catch (error) {
      console.error('Error deleting project:', error)
      messageApi.error('專案刪除失敗，請稍後再試。')
    }
  }

  const handlerChange2BrainStorm = () => {
    if (isOpenGalleryContent) return messageApi.warning('請先離開畫廊漫步')
    setIsOpenBrainStormContent(true)
  }

  const handlerChange2Gallery = () => {
    if (isOpenBrainStormContent) return messageApi.warning('請先離開靈感果醬')

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

  const handlerTallyStartProject = () => {
    if (!selectedNode || selectedNode.data.level !== 3)
      return messageApi.warning('請先選擇一個方形泡泡哦！')
    setStartProjectStatus(true)
  }
  useEffect(() => {
    getProjects()
  }, [])

  useEffect(() => {
    if (!isOpen) {
      getProjects()
    }
  }, [isOpen])

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
  const handleProjectClick = (projectId: string) => {
    if (isOpenGalleryContent) return messageApi.warning('請先離開點子畫廊')
    if (isOpenBrainStormContent) return messageApi.warning('請先離開靈感果醬')
    console.log(projectId)
    setProjectId(projectId)
    setIsOpen(true)
    setEditable(true)
  }

  const handlerOpenProjectWall = () => {
    if (isOpenGalleryContent) return messageApi.warning('請先離開點子畫廊')
    if (isOpenBrainStormContent) return messageApi.warning('請先離開靈感果醬')
    setIsProjectWallOpen(true)
  }

  const [isExpanded, setIsExpanded] = useState(false)

  const menuItems = [
    {
      icon: <img src={wavingHand} alt="" />,
      label: '探索問卷',
      prompt: '透過問卷生成心智圖',
      onClick: handlerTallyPopup
    },
    {
      icon: <img src={jamJar} alt="" />,
      label: '靈感果醬',
      prompt: '透過即興遊戲生成專案主題',
      onClick: handlerChange2BrainStorm
    },
    {
      icon: <img src={idea} alt="" />,
      label: '點子畫廊',
      prompt: '逛逛他人的心智圖',
      onClick: handlerChange2Gallery
    }
  ]

  const actionItems = [
    {
      icon: <img src={rocket} alt="" />,
      label: '開始計畫',
      prompt: '請選擇一個專案主題開始',
      onClick: handlerTallyStartProject,
      disabled:
        !selectedNode ||
        selectedNode.data.is_launched ||
        selectedNode.data.level !== 3
    },
    {
      icon: <img src={dashboard} alt="" />,
      label: '專案畫廊',
      prompt: '逛逛他人的專案',
      onClick: handlerOpenProjectWall
    },
    {
      icon: <img src={icon_discord} alt="" />,
      label: '社群互動',
      prompt: '在 Discord 中提問、交流',
      onClick: handlerAheadDiscordStatus
    }
  ]

  const projectItems = projects.map((project: Project) => ({
    icon: <img src={file} alt="" />,
    label: project.name,
    prompt: project.description,
    onClick: () => handleProjectClick(project.id.toString()),
    onDelete: () => handleProjectDelete(project.id)
  }))

  return (
    <>
      {contextHolder}

      <ViewOtherUserFrame
        isExpanded={isExpanded}
        isOpenGalleryContent={isOpenGalleryContent}
      ></ViewOtherUserFrame>
      <ProjectWall
        isWallOpen={isProjectWallOpen}
        onClose={() => setIsProjectWallOpen(false)}
      />
      <Editor
        isOpen={isOpen}
        projectId={projectId}
        isEditable={true}
        nodeId={nodeId}
      />
      <div
        className={`fixed left-0 top-0 flex h-full flex-col border-r border-gray-200 bg-gray-50 bg-opacity-30 shadow-lg transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-52' : 'w-22'
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="flex-grow p-4">
          <div className="group mb-4 flex cursor-pointer items-center pl-2">
            <img src={main_logo} alt="Groundi" className="h-8 w-8" />
            <img
              src={text_logo}
              alt="Groundi"
              className={`h-3 pl-2 ${isExpanded ? 'block' : 'hidden'}`}
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
              className={`group mb-4 ml-3 flex cursor-pointer items-center justify-between ${
                !isExpanded ? 'justify-center' : 'w-full pr-2'
              }`}
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
              className={`group mb-4 ml-3 flex cursor-pointer items-center justify-between ${
                !isExpanded ? 'justify-center' : 'w-full pr-2'
              }`}
            >
              <div
                className={`tooltip tooltip-right flex font-sans ${item.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                data-tip={item.prompt}
                onClick={item.onClick}
              >
                <span className="text-2xl text-gray-400 group-hover:text-[#6CA579]">
                  {item.icon}
                </span>
                <span
                  className={`ml-3 flex items-center font-sans text-sm ${
                    item.disabled
                      ? 'text-gray-300'
                      : 'text-gray-600 group-hover:text-[#6CA579]'
                  } ${isExpanded ? 'block' : 'hidden'}`}
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
              className={`group mb-4 ml-3 flex cursor-pointer items-center justify-between ${
                !isExpanded ? 'justify-center' : 'w-full pr-2'
              }`}
            >
              <div
                className="tooltip tooltip-right flex items-center font-sans"
                data-tip={item.prompt}
                onClick={item.onClick}
              >
                <span className="text-2xl text-gray-400 group-hover:text-[#6CA579]">
                  {item.icon}
                </span>
                {isExpanded && (
                  <span className="ml-3 max-w-[110px] truncate font-sans text-sm text-gray-600 group-hover:text-[#6CA579]">
                    {item.label}
                  </span>
                )}
              </div>
              {isExpanded && (
                <img
                  src={delete_project}
                  alt="Delete"
                  className="h-4 w-4 flex-shrink-0 transition-transform duration-200 ease-in-out hover:scale-125 hover:cursor-pointer"
                  onClick={item.onDelete}
                />
              )}
            </div>
          ))}
        </div>

        <div className={`p-4 ${isExpanded ? 'pl-4' : 'text-center'}`}>
          <div
            className={`group mb-4 ml-3 flex cursor-pointer items-center justify-between ${
              !isExpanded ? 'justify-center' : 'w-full pr-2'
            }`}
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
