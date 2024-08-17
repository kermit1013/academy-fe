import request from '../request'

export const TokenPair = async (
  user_name: string,
  passwd: string
): Promise<any> => {
  try {
    const result = await request.post('/token/pair', {
      username: user_name,
      password: passwd
    })
    if (result.status == 200) {
      return result.data
    }
  } catch (error: any) {
    return error.response.data.detail
  }
}

export const RegisterUser = async (
  user_name: string,
  email: string,
  passwd: string
): Promise<any> => {
  try {
    const result = await request.post('/users', {
      username: user_name,
      gender: '',
      email: email,
      school: '',
      grade: '',
      password: passwd
    })
    if (result.status == 201) {
      return result.data
    }
  } catch (error: any) {
    return error.response.data.detail
  }
}
