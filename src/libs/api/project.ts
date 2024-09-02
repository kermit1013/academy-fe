import request from '../request'
import { Block } from '@blocknote/core'

export const NewBlockNote = async (formData: FormData): Promise<any> => {
  try {
    const result = await request.post('/projects/files', formData)
    if (result.status === 200) {
      return result.data
    }
  } catch (error: any) {
    return error.response.data.detail
  }
}

export const GetProject = async (
  nodeId: string | undefined,
  projectId: string
): Promise<any> => {
  try {
    const result = await request.get(
      nodeId ? `/projects/nodes/${nodeId}` : `/projects/${projectId}`
    )
    if (result.status === 200) {
      return result.data
    }
  } catch (error: any) {
    return error.response.data.detail
  }
}

export const GetMyProject = async (): Promise<any> => {
  try {
    const result = await request.get('/projects/me')
    if (result.status === 200) {
      return result.data
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

export const GetProjectList = async (): Promise<any> => {
  try {
    const result = await request.get('/projects')
    if (result.status === 200) {
      return result.data
    }
  } catch (error: any) {
    return error.response.data.detail
  }
}

export const UpdateProject = async (
  content: Block[],
  projectId: string
): Promise<any> => {
  try {
    const result = await request.put(`/projects/${projectId}`, {
      content: content
    })
    if (result.status === 200) {
      return result.data
    }
  } catch (error: any) {
    return error.response.data.detail
  }
}

export const DeleteProject = async (
  projectId: string | number
): Promise<any> => {
  try {
    const result = await request.delete(`/projects/${projectId}`)
    if (result.status === 200) {
      return result.data
    }
  } catch (error: any) {
    return error.response.data.detail
  }
}

export const ExportProject = async (content: string): Promise<any> => {
  try {
    const result = await request.post('/projects/docx', { html: content }, { responseType: 'blob' })
    if (result.status === 200) {
      return result.data
    }
  } catch (error: any) {
    return error.response.data.detail
  }
}
