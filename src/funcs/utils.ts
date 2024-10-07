import styles from '../styles.module.scss'

export function stringToColor(str: string) {
  let colour = '#'
  let hash = 0

  for (const char of str) {
    hash = char.charCodeAt(0) + (hash << 5) - hash
  }

  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    colour += value.toString(16).substring(-2)
  }

  return colour.substring(0, 7)
}

export const validateEmail = (email: string) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  )
}

export const getNodeClassName = (data: {
  level: number
  is_launched: boolean
  is_visible: boolean
  isOpenBrainStormContent: boolean
}) => {
  const { level, is_launched, is_visible, isOpenBrainStormContent } = data

  if (level === 3 && is_launched) {
    return styles.node1_level3_node_is_launched
  }

  const baseClass = level === 0 ? 'node1_center' : `node1_level${level}_node`

  const classNames = [
    baseClass,
    isOpenBrainStormContent && 'brain_storm',
    is_visible && 'hover'
  ].filter(Boolean)

  return styles[classNames.join('_')]
}
