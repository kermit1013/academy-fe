import React, { useState } from 'react'
import useYDocStore from '../../stores/useYDocStore'

const Modal = () => {
  const { setProvider, setVisible, setIsConnectProcess } = useYDocStore()
  const [connectText, SetConnectText] = useState('')
  const handlerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlerConnect()
    }
  }
  const handlerConnect = () => {
    setProvider(connectText)
    setVisible(false)
    setIsConnectProcess(true)
    setTimeout(() => {
      setIsConnectProcess(false)
    }, 1500)
  }

  const handlerClose = () => {
    setVisible(false)
  }
  return (
    <div className="absolute left-1/3 top-20 z-20 flex h-12 w-1/3 rounded-lg border border-white bg-white/50 pr-3">
      <div className="relative">
        <button
          onClick={handlerClose}
          className="absolute -left-2 -top-4 h-6 w-6 rounded-full border-2 border-white text-xs text-white backdrop-blur-md"
        >
          x
        </button>
      </div>
      <input
        type="text"
        autoFocus
        value={connectText}
        onChange={(e) => SetConnectText(e.target.value)}
        onKeyDown={(e) => handlerKeyDown(e)}
        className="h-full w-full bg-transparent pl-4 font-bold text-white outline-none"
      />
      <button
        onClick={handlerConnect}
        className="border-l border-white pl-2 text-white"
      >
        Connect
      </button>
    </div>
  )
}

export default Modal
