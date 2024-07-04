import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import useStartProject from '../hooks/useStartProject'
import message from 'antd/es/message'

declare global {
  interface Window {
    Tally: any
  }
}

const TallyStartProject: React.FC = () => {
  const navigate = useNavigate()
  const [messageApi] = message.useMessage()
  const { setStartProjectStatus } = useStartProject()

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://tally.so/widgets/embed.js'
    script.onload = () => {
      if (window.Tally) {
        window.Tally.openPopup('wLdoZz', {
          overlay: true,
          onSubmit: async (payload: any) => {
            const access_token = localStorage.getItem('access_token')
            if (access_token == null) {
              navigate('/')
            }
            const data = JSON.stringify(payload)
            let encoded = encodeURI(data)
            const result = await axios.post(
              'https://api.loudy.in/api/graphs/thoughts',
              {
                data: encoded
              },
              {
                headers: {
                  Authorization: `Bearer ${access_token}`
                }
              }
            )
            if (result.status === 200) {
              messageApi.info(
                '已收到你的專案提案，我們將儘快生成你的專案計畫表，並邀請你加入 Groundi Discord 🚀'
              )
              console.log('do is_launched = true')
            }
          },
          onclose: () => {
            setStartProjectStatus(false)
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

export default TallyStartProject
