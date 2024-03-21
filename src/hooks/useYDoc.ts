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
        provider.on('synced', (isSynced) => {
          // isSynced 是一个布尔值，表示是否与其他客户端同步
          if (isSynced) {
            console.log('已成功连接并同步')
            // 这里可以设置状态或执行其他操作来反映同步状态
          } else {
            console.log('连接已断开或同步失败')
            // 根据需要处理断开连接的情况
          }
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
        })
        provider.on('synced', (isSynced) => {
          // isSynced 是一个布尔值，表示是否与其他客户端同步
          if (isSynced) {
            console.log('已成功连接并同步')
            // 这里可以设置状态或执行其他操作来反映同步状态
          } else {
            console.log('连接已断开或同步失败')
            // 根据需要处理断开连接的情况
          }
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
