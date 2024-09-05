import styles from '../styles.module.css'

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
  if (data.level === 0) {
    if (data.is_visible) return styles.node1_center_hover
    return styles.node1_center
  }
  if (data.level === 1) {
    if (data.is_visible) return styles.node1_level1_node_hover
    return styles.node1_level1_node
  }
  if (data.level === 2) {
    if (data.is_visible) {
      if (data.isOpenBrainStormContent)
        return styles.node1_level2_node_hover_alert
      return styles.node1_level2_node_hover
    } else {
      if (data.isOpenBrainStormContent) return styles.node1_level2_node_alert
      return styles.node1_level2_node
    }
  }
  if (data.level === 3) {
    if (data.is_launched) return styles.node1_level3_node_is_launched
    if (data.is_visible) return styles.node1_level3_node_hover
    return styles.node1_level3_node
  }
}
