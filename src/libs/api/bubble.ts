import request from '../request'

export const DeleteBubble = async (bubble_id: string): Promise<any> => {
  try {
    const result = await request.delete(`/graphs/nodes/${bubble_id}`)
    if (result.status === 204) {
      return result.data
    }
  } catch (error: any) {
    return error.response.data.detail
  }
}

export const NewBubble = async (
  bubble_id: string,
  label: string,
  category: string,
  reference: string
): Promise<any> => {
  try {
    const result = await request.post('/graphs/nodes', {
      source: parseInt(bubble_id),
      label: label,
      category: category,
      reference: reference
    })
    if (result.status === 200) {
      return result.data
    }
  } catch (error: any) {
    return error.response.data.detail
  }
}

export const EditBubble = async (
  bubble_id: string,
  modifyData: any
): Promise<any> => {
  try {
    const result = await request.put(`/graphs/nodes/${bubble_id}`, {
      label: modifyData
    })

    if (result.status === 200) {
      return result.data
    }
  } catch (error: any) {
    return error.response.data.detail
  }
}


export const BatchUpdateBubbles = async (nodes: Array<{ id: number, position: { x: number, y: number } }>): Promise<any> => {
  try {
    const result = await request.put('/graphs/nodes', {
      nodes: nodes
    });

    if (result.status === 200) {
      return result.data;
    }
  } catch (error: any) {
    return error.response?.data?.detail || 'An error occurred';
  }
}
