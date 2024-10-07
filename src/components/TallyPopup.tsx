import message from 'antd/es/message'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreateThought } from '../libs/api/tally'
import useTopMenuStore from '../stores/useTopMenuStore'

declare global {
  interface Window {
    Tally: any
  }
}
interface TallyPopupProps {
  getPersonData: (type: number) => Promise<void>
  setActionType: React.Dispatch<React.SetStateAction<number>>
}

const TallyPopup: React.FC<TallyPopupProps> = ({
  getPersonData,
  setActionType
}) => {
  const navigate = useNavigate()
  const [messageApi] = message.useMessage()
  const { setIsOpenTallyPopup } = useTopMenuStore()
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://tally.so/widgets/embed.js'
    script.onload = () => {
      if (window.Tally) {
        window.Tally.openPopup('n0x5Z6', {
          overlay: true,
          emoji: {
            text: '👋',
            animation: 'wave'
          },
          onSubmit: async (payload: any) => {
            const access_token = localStorage.getItem('access_token')
            if (access_token == null) {
              navigate('/')
            }
            const data = JSON.stringify(payload)
            const encoded = encodeURI(data)
            CreateThought(encoded)
              .then(() => {
                messageApi.info('心智圖已更新 🎉')
                setActionType(0)
                getPersonData(1)
              })
              .catch((error) => {
                console.error('Error fetching data:', error)
              })
          },
          onClose: () => {
            setIsOpenTallyPopup(false)
          }
        })
      }
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [navigate])

  return null
}

export default TallyPopup
