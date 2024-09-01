import request from '../request'

export const CreateThought = async (encoded: string): Promise<any> => {
  try {
    const result = await request.post('/graphs/thoughts', {
      data: encoded
    })
    if (result.status === 200) {
      return result.data
    }
  } catch (error: any) {
    return error.response.data.detail
  }
}

export const CreateProjectPlan = async (
  id: any,
  encoded: string
): Promise<any> => {
  try {
    const result = await request.post(`/projects/received/nodes/${id}`, {
      data: encoded
    })
    if (result.status === 200) {
      return result.data
    }
  } catch (error: any) {
    return error.response.data.detail
  }
}
