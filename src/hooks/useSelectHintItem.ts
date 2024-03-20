import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { IItem } from '../types/hintList'

type State = {
  hint_list: IItem[]
  source: number
  item_id: number
  label: string
}

type Actions = {
  initHintList: (_list: IItem[]) => void
  onSelectItem: (item_id: number, source: number, label: string) => void
}

const useSelectHintItem = create<State & Actions>()(
  immer((set) => ({
    hint_list: [],
    source: -1,
    item_id: -1,
    label: '',
    initHintList: (_list: IItem[]) =>
      set((state) => {
        return { ...state, hint_list: _list }
      }),
    onSelectItem: (item_id: number, source: number, label: string) =>
      set((state) => {
        return {
          ...state,
          item_id,
          source,
          label,
        }
      }),
  }))
)

export default useSelectHintItem
