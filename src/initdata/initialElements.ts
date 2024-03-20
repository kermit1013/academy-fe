import { Edge, Node } from 'reactflow'
import styles from './styles.module.css'
export const initialNodes: Node[] = [
  {
    id: 'level0_1',
    type: 'bubble',
    position: { x: 0, y: 0 },
    data: { id: 'level0_1', label: '關於你' },
    className: styles.center,
  },
  {
    id: 'level1_2',
    type: 'bubble',
    position: { x: 250, y: 250 },
    data: { id: 'level1_2', label: '困擾' },
    className: styles.level1_node,
  },
  {
    id: 'level1_3',
    type: 'bubble',
    position: { x: -250, y: -250 },
    data: { id: 'level1_3', label: '興趣' },
    className: styles.level1_node,
  },
  {
    id: 'level1_4',
    type: 'bubble',
    position: { x: -250, y: 250 },
    data: { id: 'level1_4', label: '能力' },
    className: styles.level1_node,
  },
  {
    id: 'level1_5',
    type: 'bubble',
    position: { x: 250, y: -250 },
    data: { id: 'level1_5', label: '夢想' },
    className: styles.level1_node,
  },
  {
    id: 'level1_6',
    type: 'bubble',
    position: { x: 0, y: 450 },
    data: { id: 'level1_6', label: '個人特質' },
    className: styles.level1_node,
  },
]

export const initialEdges: Edge[] = [
  {
    id: '1->2',
    source: 'level0_1',
    target: 'level1_2',
    type: 'straight',
  },
  {
    id: '1->3',
    source: 'level0_1',
    target: 'level1_3',
    type: 'straight',
  },
  {
    id: '1->4',
    source: 'level0_1',
    target: 'level1_4',
    type: 'straight',
  },
  {
    id: '1->5',
    source: 'level0_1',
    target: 'level1_5',
    type: 'straight',
  },
  {
    id: '1->6',
    source: 'level0_1',
    target: 'level1_6',
    type: 'straight',
  },
]
