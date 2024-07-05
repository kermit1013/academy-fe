import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import icon_discord from '/discord_white.svg'

interface DiscordModalProps {
  isOpen: boolean
  onClose: () => void
}

const DiscordModal = ({ isOpen, onClose }: DiscordModalProps) => {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (isOpen) {
      ref.current?.showModal()
    } else {
      ref.current?.close()
    }
  }, [isOpen])

  return createPortal(
    <dialog
      ref={ref}
      onCancel={onClose}
      className="h-[161px] w-[400px] rounded-lg backdrop:bg-black/60"
    >
      <header className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-sans text-base font-bold text-[#52525B]">
            前往 Groundi Discord 社群
          </span>
          <span className="font-sans text-[13px] text-[#52525B]">
            在 Groundi Discord
            社群中，你可以紀錄、執行「音樂與植物治療的研究」專案，並隨時提問！
          </span>
        </div>
      </header>

      <hr />

      <section className="space-y-3.5 px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          <button
            className="h-7 w-[42px] rounded-md border bg-white"
            onClick={() => onClose()}
          >
            取消
          </button>

          <a
            href="https://discord.com/invite/A3esveNmBu"
            target="_blank"
            className="flex h-7 w-[169px] items-center justify-center gap-1 rounded-md bg-[#5865F2] px-2 py-1"
          >
            <img src={icon_discord} alt="" />
            <p className="text-[13px] text-white">前往 Groundi Discord</p>
          </a>
        </div>
      </section>
    </dialog>,
    document.body
  )
}

export default DiscordModal
