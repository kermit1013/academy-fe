import { useEffect, useState } from 'react'
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceX,
  forceY,
  SimulationNodeDatum,
  SimulationLinkDatum,
} from 'd3-force'
import { useReactFlow, ReactFlowState, useStore, Node } from 'reactflow'

type UseForceLayoutOptions = {
  strength: number
  distance: number
  times: number
}

type SimNodeType = SimulationNodeDatum & Node

const elementCountSelector = (state: ReactFlowState) =>
  state.nodeInternals.size + state.edges.length
const nodesInitializedSelector = (state: ReactFlowState) =>
  Array.from(state.nodeInternals.values()).every(
    (node) => node.width && node.height
  ) && state.nodeInternals.size

function useForceLayout({
  strength = -300,
  distance = 300,
  times = 0,
}: UseForceLayoutOptions) {
  const elementCount = useStore(elementCountSelector)
  const nodesInitialized = useStore(nodesInitializedSelector)
  const { setNodes, getNodes, getEdges } = useReactFlow()
  const [simulationEnded, setSimulationEnded] = useState(false)

  useEffect(() => {
    const nodes = getNodes()
    const edges = getEdges()
    if (!nodes.length || !nodesInitialized) {
      return
    }
    const simulationNodes: SimNodeType[] = nodes.map((node) => ({
      ...node,
      x: node.position.x,
      y: node.position.y,
    }))

    const simulationLinks: SimulationLinkDatum<SimNodeType>[] = edges.map(
      (edge) => edge
    )
    const center_x = window.innerWidth / 2
    const center_y = window.innerHeight / 2

    const simulation = forceSimulation()
      .nodes(simulationNodes)
      .force('charge', forceManyBody().strength(strength))
      .force(
        'link',
        forceLink(simulationLinks)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .id((d: any) => d.id)
          .strength(1)
          .distance(distance)
      )
      .force('x', forceX().x(center_x).strength(0.01))
      .force('y', forceY().y(center_y).strength(0.01))

      .tick(300)
      .on('tick', () => {
        if (!simulationEnded) {
          setNodes(
            simulationNodes.map((node) => ({
              id: node.id,
              type: 'bubble',
              data: {
                id: node.id,
                label: node.data.label,
                position: { x: node.x ?? 0, y: node.y ?? 0 },
                category: node.data.category,
              },
              position: { x: node.x ?? 0, y: node.y ?? 0 },
              className: node.className,
            }))
          )
        }
      })
      .on('end', () => {
        console.log('Simulation ended ')
        setSimulationEnded(true)
      })
    return () => {
      simulation.stop()
    }
  }, [
    times,
    elementCount,
    getNodes,
    getEdges,
    setNodes,
    strength,
    distance,
    nodesInitialized,
  ])
}

export default useForceLayout
