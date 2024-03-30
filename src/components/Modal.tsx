import React, { useState } from 'react'
import useYDoc from '../hooks/useYDoc'

const Modal = () => {
  const [connectText, SetConnectText] = useState('')
  const { setProvider, setVisible, setIsConnectProcess } = useYDoc()
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
    <div className=" absolute top-10 left-1/3 bg-white/50 rounded-lg w-1/3 h-12 border border-white z-20 flex pr-3">
      <div className="relative">
        <button
          onClick={handlerClose}
          className=" absolute -top-4 -left-2 w-6 h-6 rounded-full backdrop-blur-md  border-2 text-xs text-white border-white "
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
        className="pl-4 bg-transparent w-full h-full  outline-none text-white font-bold"
      />
      <button
        onClick={handlerConnect}
        className="text-white border-l pl-2 border-white"
      >
        Connect
      </button>
    </div>
  )
}

export default Modal
