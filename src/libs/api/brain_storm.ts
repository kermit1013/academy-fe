import request from '../request'

export const SelectRandomContext = async (endpoint: string): Promise<any> => {
  try {
    const result = await request.get(`/interactions/${endpoint}`)
    if (result.status === 2000) {
      return result.data
    }
  } catch (error: any) {
    return error.response.data.detail
  }
}
