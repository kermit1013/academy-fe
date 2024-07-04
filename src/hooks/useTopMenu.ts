import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type State = {
  isOpenSettingModal: boolean
  isOpenGalleryContent: boolean
  isOpenBrainStormContent: boolean
}

type Actions = {
  setActionMenu: (action: number) => void
  setIsOpenSettingModal: (status: boolean) => void
  setIsOpenGalleryContent: (status: boolean) => void
  setIsOpenBrainStormContent: (status: boolean) => void
}

const useTopMenu = create<State & Actions>()(
  immer((set) => ({
    action_menu: -1,
    isOpenSettingModal: false,
    isOpenGalleryContent: false,
    isOpenBrainStormContent: false,
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
      })
  }))
)

export default useTopMenu
