import { useMemo, useState } from 'react'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'

import {
  ResetMail,
  ResetPassword,
  ResetValidate
} from '../libs/api/password_recovery'

import password_hide from '/password_hide.svg'
import password_show from '/password_show.svg'
import enter from '/prev_button.svg'
import { validateEmail } from '../funcs/utils'
const inputStyle =
  'pl-3 mt-1 block w-full border-2 border-[#7B7C7B] bg-[#7B7C7B]/10 h-11 rounded-xl shadow-lg hover:bg-[#735E5E]/20 focus:bg-[#735E5E]/20 text-[#7B7C7B] focus:outline-none'
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
              <p className="text-md text-[#7B7C7B]">電子郵件</p>
              <input
                className={inputStyle}
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
                    className="h-[3.5rem] w-[3.5rem] rounded-xl border-2 border-[#7B7C7B] bg-[#7B7C7B]/10 text-center text-base font-bold text-[#7B7C7B] hover:bg-[#735E5E]/20 focus:bg-[#735E5E]/20 focus:outline-none"
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
                <p className="text-md text-[#7B7C7B]">密碼</p>
                <div className="relative">
                  <input
                    className={inputStyle}
                    type={passwdType}
                    value={passwd}
                    onChange={(e) => {
                      setPasswd(e.target.value)
                    }}
                  />
                  <button
                    className="absolute right-3 top-3"
                    onClick={() => handlerChangePasswdType()}
                    tabIndex={-1}
                  >
                    <img
                      className="h-5 w-5 text-[#7B7C7B]"
                      src={passwdType == 'text' ? password_show : password_hide}
                      alt=""
                    />
                  </button>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-md text-[#7B7C7B]">確認密碼</p>
                <div className="relative">
                  <input
                    className={inputStyle}
                    type={passwdType}
                    value={checkPasswd}
                    onChange={(e) => {
                      setCheckPasswd(e.target.value)
                    }}
                  />
                  <button
                    className="absolute right-3 top-3"
                    onClick={() => handlerChangePasswdType()}
                    tabIndex={-1}
                  >
                    <img
                      className="h-5 w-5 text-[#7B7C7B]"
                      src={passwdType == 'text' ? password_show : password_hide}
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
    if (!validateEmail(email)) {
      return messageApi.warning('電子郵件地址格式不正確')
    }

    if (!email) return messageApi.warning('請輸入電子郵件！')

    // NOTE: 待 Kermit 調整後端 API 再將註解打開
    ResetMail(email)
      .then(() => {
        messageApi.success('已發送驗證代碼至電子郵件')
        setStep(1)
      })
      .catch((error) => {
        messageApi.warning(error.response.data.detail)
      })
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
    ResetValidate(email, codes)
      .then(() => {
        setStep(2)
      })
      .catch(() => {
        messageApi.warning('驗證代碼錯誤')
      })
  }

  // Step 2 => 更新密碼
  const handleUpdatePasswd = async () => {
    if (!passwd) return messageApi.warning('請輸入密碼！')
    if (!checkPasswd) return messageApi.warning('請輸入確認密碼！')
    if (passwd !== checkPasswd) return messageApi.warning('密碼不一致')
    ResetPassword(codes, passwd)
      .then(() => {
        messageApi.success('更新密碼成功！')
        setStep(3)
      })
      .catch(() => {
        messageApi.warning('更新密碼失敗')
      })
  }

  const handlerChangePasswdType = () => {
    if (passwdType === 'password') {
      setPasswdType('text')
    } else {
      setPasswdType('password')
    }
  }

  return (
    <div className="relative w-full sm:max-w-sm">
      <div className="relative w-full rounded-3xl border-2 border-[#7B7C7B] px-6 py-4 shadow-2xl">
        {contextHolder}
        <div className="mb-4 flex flex-col items-center justify-center gap-4">
          {/* <img className='w-1/3' src={groundi_logo} alt="" /> */}
        </div>

        <button
          className="h-10 w-10 rounded-xl border-2 border-[#7B7C7B] bg-[#7B7C7B]/10 hover:bg-[#735E5E]/20 focus:bg-[#735E5E]/20"
          onClick={() => {
            if (step === 0) {
              navigate('/')
              return
            }
            setStep(step - 1)
          }}
        >
          <img src={enter} alt="step-back" className="mx-auto" />
        </button>

        <div className="mt-5">
          <h2 className="text-2xl font-bold text-[#7B7C7B]">
            {stepList[step].title}
          </h2>
          <p className="text-md text-[#7B7C7B]">{stepList[step].desc}</p>
        </div>

        <div className="mt-5">{stepList[step].renderFields()}</div>

        <button
          className={`text-md hover:-translate-x mt-7 w-full rounded-[20px] p-3 text-white shadow-md transition duration-500 hover:scale-105 hover:shadow-inner ${
            (email === '' && step === 0) ||
            (codes.join('').length !== 5 && step === 1) ||
            ((passwd === '' || checkPasswd === '') && step === 2)
              ? 'bg-[#ABAAA6]'
              : 'bg-[#735E5E]'
          }`}
          onClick={() => stepList[step].onClick()}
          disabled={
            (email === '' && step === 0) ||
            (codes.join('').length !== 5 && step === 1) ||
            ((passwd === '' || checkPasswd === '') && step === 2)
          }
        >
          {stepList[step].buttonText}
        </button>

        {stepList[step].title === '查看你的電子郵件' && (
          <div className="mt-4 flex justify-center">
            <p className="text-center text-base text-[#7B7C7B]">
              還沒有收到電子郵件嗎？
              <span
                className="ml-1 cursor-pointer underline"
                onClick={() => handleSendCodes()}
              >
                重發電子郵件
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PasswordRecoveryPage
