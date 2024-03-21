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
          signaling: [`wss://api.loudy.in/ws/room`],
        })

        return { ...state, ydoc, provider }
      }),
    setProvider: (roomName: string) =>
      set((state) => {
        if (state.provider) {
          state.provider.destroy()
          state.ydoc.destroy()
        }

        const ydoc = new Doc()
        localStorage.setItem('roomName', roomName!)
        const provider = new WebrtcProvider(roomName, ydoc, {
          signaling: [`wss://api.loudy.in/ws/room`],
          peerOpts: {
            // STUN/TURN 配置示例
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' }, // 公共STUN服务器
              // 在生产环境中，你还需要配置TURN服务器
            ],
          },
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
