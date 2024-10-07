import { useCallback, useEffect, useMemo, useState } from 'react'
import { useReactFlow } from 'reactflow'
import { stringToColor } from '../funcs/utils'
import useYDocStore from '../stores/useYDocStore'

export type Cursor = {
  id: string
  color: string
  x: number
  y: number
  timestamp: number
}

export function useCursorStateSynced() {
  const { ydoc, provider } = useYDocStore()

  let cursorsMap = ydoc!.getMap<Cursor>('cursors')

  useEffect(() => {
    cursorsMap = ydoc!.getMap<Cursor>('cursors')
  }, [ydoc, provider])

  const cursorId = ydoc!.clientID.toString()
  const cursorColor = stringToColor(cursorId)

  const MAX_IDLE_TIME = 10000
  const [cursors, setCursors] = useState<Cursor[]>([])
  const { screenToFlowPosition } = useReactFlow()

  // Flush any cursors that have gone stale.
  const flush = useCallback(() => {
    const now = Date.now()

    for (const [id, cursor] of cursorsMap) {
      if (now - cursor.timestamp > MAX_IDLE_TIME) {
        cursorsMap.delete(id)
      }
    }
  }, [ydoc, provider])

  const onMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      })

      cursorsMap.set(cursorId, {
        id: cursorId,
        color: cursorColor,
        x: position.x,
        y: position.y,
        timestamp: Date.now()
      })
    },
    [screenToFlowPosition, ydoc, provider]
  )

  useEffect(() => {
    const timer = window.setInterval(flush, MAX_IDLE_TIME)
    const observer = () => {
      setCursors([...cursorsMap.values()])
    }

    flush()
    setCursors([...cursorsMap.values()])
    cursorsMap.observe(observer)

    return () => {
      cursorsMap.unobserve(observer)
      window.clearInterval(timer)
    }
  }, [flush, ydoc, provider])

  const cursorsWithoutSelf = useMemo(
    () => cursors.filter(({ id }) => id !== cursorId),
    [cursors, ydoc, provider]
  )

  return [cursorsWithoutSelf, onMouseMove] as const
}

export default useCursorStateSynced
