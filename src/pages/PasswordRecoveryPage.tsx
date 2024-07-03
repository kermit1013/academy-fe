import { useMemo, useState } from 'react'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'

import request from '../libs/request'

import password_hide from '/password_hide.svg'
import password_show from '/password_show.svg'
import enter from '/prev_button.svg'

const filedStyle =
  'mt-3 h-[72px] w-full rounded-[20px] border-2 border-[#7B7C7B] bg-white/30 pl-4 text-3xl focus:outline-none'

const PasswordRecoveryPage = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const navigate = useNavigate()

  // 記錄流程步驟
  const [step, setStep] = useState(0)

  const [email, setEmail] = useState('')
  const [codes, setCodes] = useState(new Array(5).fill(''))
  const [passwd, setPasswd] = useState('')
  const [checkPasswd, setCheckPasswd] = useState('')

  const [passwdType, setPasswdType] = useState('password')

  const stepList: {
    title: '忘記密碼' | '查看你的電子郵件' | '重設密碼' | '密碼已成功更新！'
    desc: string
    buttonText: string
    /** 按鈕事件 */
    onClick: () => void
    /** 渲染 Field Column */
    renderFields: () => JSX.Element
  }[] = useMemo(() => {
    return [
      {
        title: '忘記密碼',
        desc: '請輸入您的電子郵件以重設密碼',
        buttonText: '重設密碼',
        onClick: () => handleSendCodes(),
        renderFields: () => {
          return (
            <div>
              <p className="text-xl">電子郵件</p>
              <input
                className={filedStyle}
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
              />
            </div>
          )
        }
      },
      {
        title: '查看你的電子郵件',
        desc: '我們發送了一個重設連結到至您的電子郵件，請輸入電子郵件中提到的 5 位數代碼。',
        buttonText: '驗證代碼',
        onClick: () => handleCheckCodes(),
        renderFields: () => {
          return (
            <div className="flex justify-between text-[##7B7C7B]">
              {codes.map((data, index) => {
                return (
                  <input
                    key={index}
                    className="h-[4.5rem] w-[4.5rem] rounded-[20px] border-[3px] border-[#7B7C7B] text-center text-3xl font-bold focus:outline-none"
                    type="text"
                    maxLength={1}
                    value={data}
                    onChange={(e) => {
                      setCodes([
                        ...codes.map((d, idx) =>
                          idx === index ? e.target.value : d
                        )
                      ])
                      if (e.target.value && e.target.nextSibling) {
                        const nextSibling = e.target
                          .nextSibling as HTMLInputElement
                        nextSibling.focus()
                      }
                    }}
                  />
                )
              })}
            </div>
          )
        }
      },
      {
        title: '重設密碼',
        desc: '建立一個新密碼。請確保它與以前的密碼不同。',
        buttonText: '更新密碼',
        onClick: () => handleUpdatePasswd(),
        renderFields: () => {
          return (
            <>
              <div>
                <p className="text-xl">密碼</p>
                <div className="relative">
                  <input
                    className={filedStyle}
                    type={passwdType}
                    value={passwd}
                    onChange={(e) => {
                      setPasswd(e.target.value)
                    }}
                  />
                  <button
                    className="absolute right-3 top-7"
                    onClick={() => handlerChangePasswdType()}
                    tabIndex={-1}
                  >
                    <img
                      className="w-10 text-[#7B7C7B]"
                      src={passwdType == 'text' ? password_hide : password_show}
                      alt=""
                    />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xl">確認密碼</p>
                <div className="relative">
                  <input
                    className={filedStyle}
                    type={passwdType}
                    value={checkPasswd}
                    onChange={(e) => {
                      setCheckPasswd(e.target.value)
                    }}
                  />
                  <button
                    className="absolute right-3 top-7"
                    onClick={() => handlerChangePasswdType()}
                    tabIndex={-1}
                  >
                    <img
                      className="w-10 text-[#7B7C7B]"
                      src={passwdType == 'text' ? password_hide : password_show}
                      alt=""
                    />
                  </button>
                </div>
              </div>
            </>
          )
        }
      },
      {
        title: '密碼已成功更新！',
        desc: '',
        buttonText: '重新登入',
        onClick: () => {
          navigate('/')
        },
        renderFields: () => {
          return <></>
        }
      }
    ]
  }, [step, email, codes, passwd, checkPasswd, passwdType])

  // Step 0 => 發送驗證碼
  const handleSendCodes = async () => {
    if (!email) return messageApi.warning('請輸入電子郵件！')

    try {
      // NOTE: 待 Kermit 調整後端 API 再將註解打開
      const result = await request.get('/users/reset-email', {
        params: {
          email
        }
      })
      if (result.status == 200) {
        messageApi.success('已發送驗證碼到信箱')
        setStep(1)
      }
    } catch (error: any) {
      messageApi.warning(error.response.data.detail)
    }
  }

  // Step 1 => 檢查驗證碼
  const handleCheckCodes = async () => {
    // 檢查驗證碼是否有空值
    for (const code of codes) {
      if (!code) {
        messageApi.warning('請完成驗證碼')
        return
      }
    }
    try {
      const result = await request.get('/users/reset-validate', {
        params: {
          email,
          code: codes.join('')
        }
      })
      if (result.status == 200) {
        setStep(2)
      }
      setStep(2)
    } catch (error: any) {
      messageApi.warning(error.response.data.detail)
    }
  }

  // Step 2 => 更新密碼
  const handleUpdatePasswd = async () => {
    if (!passwd) return messageApi.warning('請輸入密碼！')
    if (!checkPasswd) return messageApi.warning('請輸入確認密碼！')
    if (passwd !== checkPasswd) return messageApi.warning('密碼不一致！')
    try {
      const result = await request.post('/users/reset-password', {
        code: codes.join(''),
        password: passwd
      })
      if (result.status == 200) {
        messageApi.success('更新密碼成功！')
        setStep(3)
      }
      setStep(3)
    } catch (error: any) {
      messageApi.warning(error.response.data.detail)
    }
  }

  const handlerChangePasswdType = () => {
    if (passwdType === 'password') {
      setPasswdType('text')
    } else {
      setPasswdType('password')
    }
  }

  return (
    <div className="z-20 flex h-[694px] w-[520px] flex-col justify-start gap-6 rounded-[50px] border-[3px] border-[#7B7C7B] bg-white/20 p-10 text-[#7B7C7B] backdrop-blur-sm">
      {contextHolder}

      <button
        className="h-10 w-10 rounded-md border border-[#7B7C7B80] bg-[#D9D9D933]"
        onClick={() => {
          if (step === 0) {
            navigate('/')
            return
          }

          setStep(step - 1)
        }}
      >
        <img src={enter} alt="step-back" className="mx-auto border-red-300" />
      </button>

      <div>
        <h2 className="text-[2rem] font-bold text-[#7B7C7B]">
          {stepList[step].title}
        </h2>
        <p className="text-xl">{stepList[step].desc}</p>
      </div>

      {stepList[step].renderFields()}

      {(email == '' && step == 0) ||
      (codes.join('').length != 5 && step == 1) ||
      ((passwd == '' || checkPasswd == '') && step == 2) ? (
        <button
          className="h-[72px] w-full rounded-[20px] bg-[#7B7C7B]/20 p-4 text-2xl text-[#7B7C7B]/50"
          onClick={() => stepList[step].onClick()}
        >
          {stepList[step].buttonText}
        </button>
      ) : (
        <button
          className="h-[72px] w-full rounded-[20px] bg-[#735E5E] p-4 text-2xl text-white"
          onClick={() => stepList[step].onClick()}
        >
          {stepList[step].buttonText}
        </button>
      )}

      {stepList[step].title === '查看你的電子郵件' && (
        <p className="text-center text-xl">
          還沒有收到電子郵件嗎？
          <span
            className="cursor-pointer underline"
            onClick={() => handleSendCodes()}
          >
            重發電子郵件
          </span>
        </p>
      )}
    </div>
  )
}

export default PasswordRecoveryPage
