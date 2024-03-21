import { Doc } from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type State = {
  ydoc: Doc
  provider: WebrtcProvider | null
  isVisible: boolean
  isConnect: boolean
  isConnectProcess: boolean
}

type Actions = {
  initProvider: () => void
  setProvider: (room_id: string) => void
  setVisible: (status: boolean) => void
  setIsConnect: (status: boolean) => void
  setIsConnectProcess: (status: boolean) => void
}
const generateRandomRoomName = (): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const charactersLength = characters.length
  for (let i = 0; i < 16; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
const useYDoc = create<State & Actions>()(
  immer((set) => ({
    provider: null,
    ydoc: new Doc(),
    isVisible: false,
    isConnect: false,
    isConnectProcess: false,
    initProvider: () =>
      set((state) => {
        const ydoc = new Doc()

        const roomName = generateRandomRoomName()
        localStorage.setItem('roomName', roomName!)
        const provider = new WebrtcProvider(roomName!, ydoc, {
          signaling: [`wss://api.loudy.in/ws`],
        })

        return { ...state, ydoc, provider }
      }),
    setProvider: (roomName: string) =>
      set((state) => {
        if (state.provider) {
          console.log('destroy')
          state.provider.destroy()
          state.ydoc.destroy()
        }

        const ydoc = new Doc()
        localStorage.setItem('roomName', roomName!)
        const provider = new WebrtcProvider(roomName, ydoc, {
          signaling: [`wss://api.loudy.in/ws`],
        })
        const isConnect = true
        return { ...state, ydoc, provider, isConnect }
      }),
    setVisible: (status: boolean) => {
      set(() => ({ isVisible: status }))
    },
    setIsConnect: (status: boolean) => {
      set(() => ({ isConnect: status }))
    },
    setIsConnectProcess: (status: boolean) => {
      set(() => ({ isConnectProcess: status }))
    },
  }))
)

export default useYDoc
