import { message } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useStoreApi } from 'reactflow'

import { getNodeClassName } from '../funcs/utils'
import useAheadDiscord from '../hooks/useAheadDiscord'
import useEdgesStateSynced from '../hooks/useEdgesStateSynced'
import useEditor from '../hooks/useEditor'
import useNodesStateSynced from '../hooks/useNodesStateSynced'
import useStartProject from '../hooks/useStartProject'
import useTopMenu from '../hooks/useTopMenu'
import { DeleteProject, GetMyProject } from '../libs/api/project'
import Editor from './Editor'
import ProjectWall from './ProjectWall'

import discord from '/discord.svg'
import text_logo from '/groundi_text.svg'
import dashboard from '/nav_icons/dashboard.svg'
import delete_project from '/nav_icons/delete.svg'
import file from '/nav_icons/file.svg'
import idea from '/nav_icons/idea.svg'
import jamJar from '/nav_icons/jam_jar.svg'
import main_logo from '/nav_icons/logo.svg'
import rocket from '/nav_icons/rocket.svg'
import wavingHand from '/nav_icons/waving_hand.svg'
import setting from '/setting.svg'

const titleByGroupType = {
  menuItems: '發想主題',
  actionItems: '執行計畫'
}

interface Project {
  id: string | number
  name: string
  description: string
}

const NavDrawer = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const { setAheadDiscordStatus } = useAheadDiscord()
  const setNodes = useNodesStateSynced()[1]
  const setEdges = useEdgesStateSynced()[1]
  const { selectedNode, setStartProjectStatus } = useStartProject()
  const { isOpen, setIsOpen, projectId, setProjectId, setEditable, nodeId } =
    useEditor()
  const store = useStoreApi()
  const {
    isOpenTallyPopup,
    isOpenBrainStormContent,
    isOpenGalleryContent,
    isOpenProjectWall,
    setIsOpenTallyPopup,
    setIsOpenBrainStormContent,
    setIsOpenGalleryContent,
    setIsOpenProjectWall,
    setIsOpenSettingModal
  } = useTopMenu()

  const { getNodes, edges } = store.getState()
  const nodes = getNodes()
  // 判斷是否有第 2 層泡泡
  const hasLevel2Bubble = useMemo(() => {
    return nodes.some((node) => node.data.level === 2)
  }, [nodes])
  // 判斷是否有第 3 層泡泡
  const hasLevel3Bubble = useMemo(() => {
    return nodes.some((node) => node.data.level === 3)
  }, [nodes])

  const [projects, setProjects] = useState([])
  const [isExpanded, setIsExpanded] = useState(false)

  // #region 處理訊息開啟功能
  // 針對不同狀態的提示訊息
  const checkOpenStatus = useCallback(() => {
    if (isOpenTallyPopup) return '請先離開探索問卷！'
    if (isOpenBrainStormContent) return '請先離開靈感果醬！'
    if (isOpenGalleryContent) return '請先離開點子畫廊！'
    if (isOpenProjectWall) return '請先離開專案畫廊！'
    return null
  }, [
    isOpenTallyPopup,
    isOpenBrainStormContent,
    isOpenGalleryContent,
    isOpenProjectWall
  ])

  // 在執行函式前，檢查是否有開啟其它功能
  const handleAction = (action: () => void) => {
    const statusMessage = checkOpenStatus()
    statusMessage ? messageApi.warning(statusMessage) : action()
  }

  // 開啟 Setting Modal
  const handlerSetting = () => setIsOpenSettingModal(true)

  // 開啟 Discord
  const handlerAheadDiscordStatus = () => setAheadDiscordStatus(true)

  // 開啟 Tally Popup (探索問卷)
  const handlerTallyPopup = () => handleAction(() => setIsOpenTallyPopup(true))

  // 開啟 BrainStorm Content (探索問卷)
  const handlerChange2BrainStorm = () =>
    handleAction(() => {
      if (!hasLevel2Bubble) {
        return messageApi.warning('請先新增第三層的心智圖泡泡！')
      }

      const updateNodes = nodes.map((node) => ({
        ...node,
        className: getNodeClassName({
          level: node.data.level,
          is_launched: node.data.is_launched,
          is_visible: node.data.is_visible,
          isOpenBrainStormContent: true
        })
      }))

      const updateEdges = edges.map((edge) => ({
        ...edge,
        style: { stroke: '#c4c4c4', strokeWidth: 2 }
      }))

      setNodes(updateNodes)
      setEdges(updateEdges)
      setIsOpenBrainStormContent(true)
    })

  // 開啟 Gallery Content (點子畫廊)
  const handlerChange2Gallery = () =>
    handleAction(() => setIsOpenGalleryContent(true))

  // 開啟 Project Wall (專案畫廊)
  const handlerOpenProjectWall = () =>
    handleAction(() => setIsOpenProjectWall(true))

  // 開啟 Project Editor
  const handleProjectClick = (projectId: string) => {
    handleAction(() => {
      setProjectId(projectId)
      setIsOpen(true)
      setEditable(true)
    })
  }

  const handlerTallyStartProject = useCallback(() => {
    const validations = [
      {
        isValid: () => selectedNode,
        errorMessage: '請先選擇泡泡哦！'
      },
      {
        isValid: () => hasLevel3Bubble,
        errorMessage: '請先透過「探索問卷」產生心智圖，或自行新增心智圖泡泡！'
      },
      {
        isValid: () => selectedNode?.data.label !== '',
        errorMessage: '請填寫內容後在開始計劃！'
      },
      {
        isValid: () => selectedNode?.data.level === 3,
        errorMessage: '請先選擇一個方形泡泡哦！'
      },
      {
        isValid: () => !selectedNode?.data.is_launched,
        errorMessage: '該方形泡泡已經與專案綁定！'
      }
    ]

    const invalidMessage = validations.find(
      (validation) => !validation.isValid()
    )?.errorMessage

    invalidMessage
      ? messageApi.warning(invalidMessage)
      : setStartProjectStatus(true)
  }, [selectedNode, hasLevel3Bubble])

  // #endregion

  const handleProjectDelete = async (projectId: string | number) => {
    if (!confirm('確定刪除該專案嗎？')) return

    try {
      await DeleteProject(projectId)
      setProjects(
        projects.filter((project: Project) => project.id !== projectId)
      )
      messageApi.success('專案刪除成功！')
      window.location.reload()
    } catch (error) {
      console.error('Error deleting project:', error)
      messageApi.error('專案刪除失敗，請稍後再試。')
    }
  }

  const getProjects = async () => {
    try {
      const result = await GetMyProject()
      setProjects(result)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const renderItemType = {
    menuItems: [
      {
        icon: <img src={wavingHand} alt="" />,
        label: '探索問卷',
        prompt: '透過問卷生成心智圖',
        onClick: !isOpenTallyPopup ? handlerTallyPopup : () => {},
        disabled: isOpenTallyPopup
      },
      {
        icon: <img src={jamJar} alt="" />,
        label: '靈感果醬',
        prompt: '透過即興遊戲生成專案主題',
        onClick: !isOpenBrainStormContent ? handlerChange2BrainStorm : () => {},
        disabled: isOpenBrainStormContent
      },
      {
        icon: <img src={idea} alt="" />,
        label: '點子畫廊',
        prompt: '逛逛他人的心智圖',
        onClick: !isOpenGalleryContent ? handlerChange2Gallery : () => {},
        disabled: isOpenGalleryContent
      }
    ],
    actionItems: [
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
        onClick: !isOpenProjectWall ? handlerOpenProjectWall : () => {},
        disabled: isOpenProjectWall
      },
      {
        icon: <img src={discord} alt="" />,
        label: '社群互動',
        prompt: '在 Discord 中提問、交流',
        onClick: handlerAheadDiscordStatus
      }
    ]
  }

  const projectItems = projects.map((project: Project) => ({
    icon: <img src={file} alt="" />,
    label: project.name,
    prompt: project.description,
    onClick: () => handleProjectClick(project.id.toString()),
    onDelete: () => handleProjectDelete(project.id)
  }))

  useEffect(() => {
    if (!isOpen) {
      getProjects()
    }
  }, [isOpen])

  useEffect(() => {
    getProjects()
  }, [])

  return (
    <>
      {contextHolder}

      <ViewOtherUserFrame
        isExpanded={isExpanded}
        isOpenGalleryContent={isOpenGalleryContent}
      ></ViewOtherUserFrame>
      <ProjectWall
        isWallOpen={isOpenProjectWall}
        onClose={() => setIsOpenProjectWall(false)}
      />
      <Editor
        isOpen={isOpen}
        projectId={projectId}
        isEditable={true}
        nodeId={nodeId}
      />
      <div
        className={`fixed left-0 top-0 flex h-full flex-col border-r border-gray-200 bg-gray-50 bg-opacity-30 shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out ${
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

          {Object.entries(renderItemType).map(([key, items], index) => (
            <>
              <section>
                <div
                  className={`mb-4 font-sans text-xs font-medium text-[#6CA579] ${isExpanded ? 'block' : 'text-center'}`}
                  key={`${key}-${index}`}
                >
                  {titleByGroupType[key as keyof typeof titleByGroupType]}
                </div>
                {items.map((item, index) => (
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
                      onTouchStart={item.onClick}
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
              </section>
              {index < Object.keys(renderItemType).length - 1 && (
                <div className="my-4 border-t border-gray-200" />
              )}
            </>
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
          className={`${isExpanded ? 'left-[194px] w-[calc(100vw-194px)]' : 'left-[67px] w-[calc(100vw-67px)]'} absolute -top-[15px] -z-50 h-2 bg-[#EF6E52]`}
        ></div>
        <div
          className={`${isExpanded ? 'left-[194px]' : 'left-[67px]'} absolute -top-[15px] -z-50 h-screen w-2 bg-[#EF6E52]`}
        ></div>
        <div
          className={`${isExpanded ? 'left-[194px] w-[calc(100vw-194px)]' : 'left-[67px] w-[calc(100vw-67px)]'} absolute -bottom-[calc(100vh-15px)] -z-50 h-2 bg-[#EF6E52]`}
        ></div>
        <div className="absolute -top-[15px] right-[calc(-100vw+15px)] -z-50 h-screen w-2 bg-[#EF6E52]"></div>{' '}
      </>
    )
  )
}

export default NavDrawer
