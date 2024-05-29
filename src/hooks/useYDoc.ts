import { Doc } from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type State = {
  ydoc: Doc
  provider: WebsocketProvider | null
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
        if (state.provider) {
          console.log(state.provider.roomname)
          state.provider.disconnect()
          state.provider.destroy()
          state.ydoc.destroy()
        }
        const ydoc = new Doc()

        const roomName = generateRandomRoomName()
        console.log(roomName)
        localStorage.setItem('roomName', roomName!)
        const provider = new WebsocketProvider(
          'wss://api.loudy.in/ws',
          roomName,
          ydoc
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        provider.on('status', (event: any) => {
          console.log(event.status) // logs "connected" or "disconnected"
        })
        // console.log(provider.roomname)
        return { ...state, ydoc, provider }
      }),
    setProvider: (roomName: string) =>
      set((state) => {
        if (state.provider) {
          console.log(state.provider.roomname)

          state.provider.disconnect()
          state.provider.destroy()
          state.ydoc.destroy()
        }

        const ydoc = new Doc()
        localStorage.setItem('roomName', roomName!)
        console.log(roomName)
        const provider = new WebsocketProvider(
          'wss://api.loudy.in/ws',
          roomName,
          ydoc
        )

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        provider.on('status', (event: any) => {
          console.log(event)

          console.log(event.status) // logs "connected" or "disconnected"
        })
        console.log(provider.roomname)
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
