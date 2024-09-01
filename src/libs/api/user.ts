import request from '../request'

export const GetUserInfo = async (
  action_type: number,
  user_id: number | undefined
): Promise<any> => {
  try {
    const url =
      action_type === -1
        ? `/users/me?user_id=${user_id}`
        : action_type === 1
          ? '/users/me?user_id=0'
          : '/users/me'
    const result = await request.get(url)

    if (result.status == 200) {
      return result.data
    }
  } catch (error: any) {
    return error.response.data.detail
  }
}
