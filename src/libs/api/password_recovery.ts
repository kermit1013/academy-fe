import request from '../request'

export const ResetMail = async (email: string): Promise<any> => {
  try {
    const result = await request.get('/users/reset-validate', {
      params: {
        email
      }
    })
    if (result.status === 200) {
      return result.data
    }
    return null
  } catch (error: any) {
    return error.response.data.detail
  }
}

export const ResetValidate = async (
  email: string,
  codes: string[]
): Promise<any> => {
  try {
    const result = await request.get('/users/reset-validate', {
      params: {
        email,
        code: codes.join('')
      }
    })
    if (result.status == 200) {
      return result.data
    }
  } catch (error: any) {
    return error.response.data.detail
  }
}

export const ResetPassword = async (
  codes: string[],
  passwd: string
): Promise<any> => {
  try {
    const result = await request.post('/users/reset-password', {
      code: codes.join(''),
      password: passwd
    })
    if (result.status == 200) {
      return result.data
    }
  } catch (error: any) {
    return error.response.data.detail
  }
}
