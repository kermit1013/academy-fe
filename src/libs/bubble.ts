import { Edge } from 'reactflow'
import { getNodeClassName } from '../funcs/utils'

export interface BubbleProps {
  data: {
    id: string
    label: string
    category: string
    isVisible: boolean
    level: number
    is_launched: boolean
    reference: string
  }
}

// ... 現有的代碼 ...

export const createNewBubbleNode = (
  result: any,
  parentId: string,
  position: { x: number; y: number }
): { node: any; edge: Edge } => {
  const childNode = {
    id: `${result.id}`,
    type: 'bubble',
    position: position,
    data: {
      id: `${result.id}`,
      label: result.label,
      category: result.category,
      level: result.level,
      is_launched: false,
      reference: result.reference
    },
    className: getNodeClassName({
      level: result.level,
      is_launched: false,
      is_visible: false,
      isOpenBrainStormContent: false
    })
  }

  const childEdge: Edge = {
    id: `${parentId}->${result.id}`,
    source: parentId,
    target: `${result.id}`,
    type: 'straight'
  }

  return { node: childNode, edge: childEdge }
}
