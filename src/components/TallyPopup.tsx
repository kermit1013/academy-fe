import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import message from 'antd/es/message'
import useTopMenu from '../hooks/useTopMenu'
import { CreateThought } from '../libs/api/tally'

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
  const { setIsOpenTallyPopup } = useTopMenu()
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
            let encoded = encodeURI(data)
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
