import { useEffect } from 'react'
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  // forceX,
  // forceY,
  SimulationNodeDatum,
  SimulationLinkDatum
} from 'd3-force'
import { useReactFlow, ReactFlowState, useStore, Node } from 'reactflow'

type UseForceLayoutOptions = {
  strength: number
  distance: number
  setIsLoading: any
  userId: number
}

type SimNodeType = SimulationNodeDatum & Node

const elementCountSelector = (state: ReactFlowState) =>
  state.nodeInternals.size + state.edges.length
// const nodesInitializedSelector = (state: ReactFlowState) =>
//   Array.from(state.nodeInternals.values()).every(
//     (node) => node.width && node.height
//   ) && state.nodeInternals.size

function useForceLayout({
  strength = -300,
  distance = 300,
  setIsLoading = true,
  userId = 0
}: UseForceLayoutOptions) {
  const elementCount = useStore(elementCountSelector)
  // const nodesInitialized = useStore(nodesInitializedSelector)
  const { setNodes, getNodes, getEdges, fitView } = useReactFlow()
  useEffect(() => {
    setIsLoading(true)
    const nodes = getNodes()
    const edges = getEdges()
    if (!nodes.length) {
      return
    }
    const simulationNodes: SimNodeType[] = nodes.map((node) => ({
      ...node,
      x: node.position.x,
      y: node.position.y
    }))

    const simulationLinks: SimulationLinkDatum<SimNodeType>[] = edges.map(
      (edge) => edge
    )
    forceSimulation()
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
      .alphaDecay(0.0228)
      .alphaMin(0.3)
      .on('tick', () => {
        fitView({ nodes: simulationNodes })
        setNodes(
          simulationNodes.map((node) => ({
            id: node.id,
            type: 'bubble',
            data: node.data,
            position: { x: node.x ?? 0, y: node.y ?? 0 },
            className: node.className
          }))
        )
      })
      .on('end', () => {
        console.log('Simulation ended ')
        setIsLoading(false)
      })
  }, [
    elementCount,
    getNodes,
    getEdges,
    setNodes,
    userId
  ])
}

export default useForceLayout
