import request from '../request'

export const TokenPair = async (
  username: string,
  passwd: string
): Promise<any> => {
  try {
    const result = await request.post('/token/pair', {
      username: username,
      password: passwd
    })
    if (result.status == 200) {
      return result
    }
  } catch (error: any) {
    return error.response.data.detail
  }
}

export const OauthGoogle = async (
  credential: string,
): Promise<any> => {
  try {
    const result = await request.post('/oauth/google', {
      credential: credential,
    })
    if (result.status == 200) {
      return result
    }
  } catch (error: any) {
    return error.response.data.detail
  }
}

export const RegisterUser = async (
  username: string,
  email: string,
  passwd: string
): Promise<any> => {
  const result = await request.post('/users', {
    username: username,
    gender: '',
    email: email,
    school: '',
    grade: '',
    password: passwd
  })
  if (result.status == 200) {
    return result.data
  }
}
