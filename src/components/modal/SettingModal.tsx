import { Switch, message } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'

import request from '../../libs/request'

import Input from '../fieldItem/Input'
import Select from '../fieldItem/Select'

import close_btn from '/close_btn.svg'
import icon_building from '/icons/icon_building.svg'
import icon_discord from '/icons/icon_discord.svg'
import icon_eye from '/icons/icon_eye.svg'
import icon_gender from '/icons/icon_gender.svg'
import icon_instagram from '/icons/icon_instagram.svg'
import icon_logout from '/icons/icon_logout.svg'
import icon_user from '/icons/icon_user.svg'

// TODO: 取得使用者資料，可優化吃 Cache 或 localStorage，並在修改成功後更新 localStorage，避免重複取得個人資訊 API

interface SettingModalProps {
  isOpen: boolean
  onClose: () => void
}

interface IUserInfo {
  id: number
  username: string
  gender: string
  email: string
  school: string
  grade: string
  is_public: boolean
}

const SettingModal = ({ isOpen, onClose }: SettingModalProps) => {
  const [messageApi, contextHolder] = message.useMessage()
  const navigate = useNavigate()

  const ref = useRef<HTMLDialogElement>(null)

  const [userData, setUserData] = useState({} as IUserInfo)
  const [formValue, setFormValue] = useState({
    gender: '',
    school: '',
    grade: '',
    is_public: true
  })

  const [isFetch, setIsFetch] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)

  const reset = () => {
    setFormValue({
      gender: '',
      school: '',
      grade: '',
      is_public: true
    })
  }

  const handleLogout = async () => {
    navigate('/')
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_id')
    localStorage.removeItem('user_name')
    localStorage.removeItem('roomName')
  }

  // 取得個人資訊
  const fetchGetUserInfo = async () => {
    if (isFetch) return
    setIsFetch(true)
    try {
      const res = await request.get('/users/me')
      if (!res.data) throw new Error('取得使用者資訊失敗')

      const data = res.data as IUserInfo
      setUserData(data)
    } catch (error: any) {
      messageApi.error(error.response.data.detail)
    } finally {
      setIsFetch(false)
    }
  }

  // 儲存個人資訊
  const handleSaveUserInfo = async () => {
    if (isSubmit) return
    setIsSubmit(true)
    try {
      const res = await request.put(`/users/${userData?.id}`, formValue)
      if (res.status === 200) messageApi.success('儲存成功')
    } catch (error: any) {
      messageApi.error(error.response.data.detail)
    } finally {
      setIsSubmit(false)
    }
  }

  useEffect(() => {
    if (userData) {
      const { gender, school, grade, is_public } = userData
      setFormValue({
        gender: gender,
        school: school,
        grade: grade,
        is_public: is_public
      })
    }
  }, [userData])

  useEffect(() => {
    if (isOpen) {
      ref.current?.showModal()
      fetchGetUserInfo()
    } else {
      reset()
      ref.current?.close()
    }
  }, [isOpen])

  return createPortal(
    <dialog
      ref={ref}
      onCancel={onClose}
      className="w-72 rounded-lg py-4 backdrop:bg-black/60"
    >
      {contextHolder}

      <header className="px-4">
        <h3 className="flex items-center justify-between pb-2 text-xl font-medium">
          <span>{userData.username}</span>
          <img
            className="h-5 w-5 cursor-pointer"
            src={close_btn}
            alt="close"
            onClick={() => onClose()}
          />
        </h3>
        <span className="text-[#52525B]">{userData.email}</span>
      </header>

      <hr className="my-2" />

      <section className="space-y-3.5 px-4">
        <div className="flex items-center gap-2">
          <img src={icon_gender} alt="icon" className="h-5 w-5" />
          <p>性別</p>
          <div className="flex-1">
            <Select
              id={'gender'}
              value={formValue.gender}
              options={[
                { value: '1', label: '女性' },
                { value: '2', label: '男性' },
                { value: '3', label: '非二元性別' },
                { value: '4', label: '不願透露' }
              ]}
              onChange={(e) => {
                setFormValue((prev) => {
                  return {
                    ...prev,
                    gender: e.target.value
                  }
                })
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <img src={icon_user} alt="icon" className="h-5 w-5" />
          <p>身份</p>
          <div className="flex-1">
            <Select
              id={'school'}
              value={formValue.school}
              options={[
                { value: '1', label: '高中生' },
                { value: '2', label: '大學生' },
                { value: '3', label: '社會人士' },
                { value: '4', label: '其它' }
              ]}
              onChange={(e) => {
                setFormValue((prev) => {
                  return {
                    ...prev,
                    school: e.target.value
                  }
                })
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <img src={icon_building} alt="icon" className="h-5 w-5" />
          <p>單位</p>
          <div className="flex-1">
            <Input
              id={'grade'}
              value={formValue.grade}
              plaeceholder={'就讀學校/任職公司'}
              onChange={(e) => {
                setFormValue((prev) => {
                  return {
                    ...prev,
                    grade: e.target.value
                  }
                })
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <img src={icon_eye} alt="icon" className="h-5 w-5" />
          <p className="flex-1">公開你的心智泡泡</p>
          <Switch
            checked={formValue.is_public}
            onChange={(e) => {
              setFormValue((prev) => {
                return {
                  ...prev,
                  is_public: e
                }
              })
            }}
          />
        </div>

        <button
          className="w-full rounded-md border py-2 font-medium hover:bg-gray-100"
          disabled={isSubmit}
          onClick={handleSaveUserInfo}
        >
          儲存
        </button>
      </section>

      <hr className="my-2" />

      <section className="space-y-3 px-4">
        <div className="flex cursor-pointer items-center gap-2">
          <img src={icon_instagram} alt="Instagram" className="h-5 w-5" />
          <a href="https://instagram.com/return_inn" target="_blank">
            Instagram
          </a>
        </div>

        <div className="flex cursor-pointer items-center gap-2">
          <img src={icon_discord} alt="Discord" className="h-5 w-5" />
          <a href="https://discord.gg/rA845Bwa" target="_blank">
            Discord
          </a>
        </div>
      </section>

      <hr className="my-2" />

      <footer className="space-y-3 px-4">
        <div
          className="flex cursor-pointer items-center gap-2"
          onClick={handleLogout}
        >
          <img src={icon_logout} alt="icon" className="h-5 w-5" />
          <p>Log out</p>
        </div>
        <p className="text-[#A1A1AA]">Groundi Beta Version</p>
      </footer>
    </dialog>,
    document.body
  )
}

export default SettingModal
