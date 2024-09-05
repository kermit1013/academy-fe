import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type State = {
  isOpenSettingModal: boolean
  isOpenGalleryContent: boolean
  isOpenBrainStormContent: boolean
  isOpenProjectWall: boolean
  isOpenTallyPopup: boolean
}

type Actions = {
  setActionMenu: (action: number) => void
  setIsOpenSettingModal: (status: boolean) => void
  setIsOpenGalleryContent: (status: boolean) => void
  setIsOpenBrainStormContent: (status: boolean) => void
  setIsOpenTallyPopup: (status: boolean) => void
  setIsOpenProjectWall: (status: boolean) => void
}

const useTopMenu = create<State & Actions>()(
  immer((set) => ({
    action_menu: -1,
    isOpenSettingModal: false,
    isOpenGalleryContent: false,
    isOpenBrainStormContent: false,
    isOpenTallyPopup: false,
    isOpenProjectWall: false,
    setActionMenu: (action: number) =>
      set((state) => {
        return { ...state, action_menu: action }
      }),
    setIsOpenSettingModal: (status: boolean) =>
      set((state) => {
        return { ...state, isOpenSettingModal: status }
      }),
    setIsOpenGalleryContent: (status: boolean) =>
      set((state) => {
        return { ...state, isOpenGalleryContent: status }
      }),
    setIsOpenBrainStormContent: (status: boolean) =>
      set((state) => {
        return { ...state, isOpenBrainStormContent: status }
      }),
    setIsOpenTallyPopup: (status: boolean) =>
      set((state) => {
        return { ...state, isOpenTallyPopup: status }
      }),
    setIsOpenProjectWall: (status: boolean) =>
      set((state) => {
        return { ...state, isOpenProjectWall: status }
      })
  }))
)

export default useTopMenu
