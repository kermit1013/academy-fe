import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useStartProject from '../hooks/useStartProject'
import message from 'antd/es/message'
import { CreateProjectPlan } from '../libs/api/tally'

declare global {
  interface Window {
    Tally: any
  }
}

const TallyStartProject: React.FC = () => {
  const navigate = useNavigate()
  const [messageApi] = message.useMessage()
  const { selectedNode, setStartProjectStatus } = useStartProject()

  useEffect(() => {
    console.log(selectedNode)
    const script = document.createElement('script')
    script.src = 'https://tally.so/widgets/embed.js'
    script.onload = () => {
      if (window.Tally) {
        window.Tally.openPopup('wLdoZz', {
          layout: 'modal',
          overlay: true,
          width: 400,
          onSubmit: async (payload: any) => {
            const access_token = localStorage.getItem('access_token')
            if (access_token == null) {
              navigate('/')
              return
            }
            const data = JSON.stringify(payload)
            let encoded = encodeURI(data)
            CreateProjectPlan(selectedNode?.data.id, encoded)
              .then(() => {
                messageApi.info(
                  '已收到你的專案提案，我們將儘快生成你的專案計畫表，並邀請你加入 Groundi Discord 🚀'
                )
                console.log('do is_launched = true')
              })
              .catch((error) => {
                console.error('Error fetching data:', error)
              })
          },
          onClose: () => {
            setStartProjectStatus(false)
            window.location.reload()
          }
        })
      }
    }
    document.body.appendChild(script)

    return () => {
      setStartProjectStatus(false)
      document.body.removeChild(script)
    }
  }, [navigate])

  return null
}

export default TallyStartProject
