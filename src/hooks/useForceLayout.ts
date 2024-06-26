import { useEffect, useState } from 'react'
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  // forceX,
  // forceY,
  SimulationNodeDatum,
  SimulationLinkDatum,
} from 'd3-force'
import { useReactFlow, ReactFlowState, useStore, Node } from 'reactflow'

type UseForceLayoutOptions = {
  strength: number
  distance: number
  times: number,
  setIsLoading: any
}

type SimNodeType = SimulationNodeDatum & Node

const elementCountSelector = (state: ReactFlowState) =>
  state.nodeInternals.size + state.edges.length
const nodesInitializedSelector = (state: ReactFlowState) =>
  Array.from(state.nodeInternals.values()).every(
    (node) => node.width && node.height
  ) && state.nodeInternals.size
  let tickCount = 0;
  const maxTicks = 150;
function useForceLayout({
  strength = -300,
  distance = 300,
  times = 0,
  setIsLoading = true,
}: UseForceLayoutOptions) {
  const elementCount = useStore(elementCountSelector)
  const nodesInitialized = useStore(nodesInitializedSelector)
  const { setNodes, getNodes, getEdges, fitView } = useReactFlow()
  const [simulationEnded, setSimulationEnded] = useState(false)

  useEffect(() => {
    setIsLoading(true)
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
      .on('tick', () => {
        if (!simulationEnded) {
          fitView({ nodes: simulationNodes })
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

          tickCount += 1;     
          if (tickCount >= maxTicks) {
            !simulationEnded ? setSimulationEnded(true) : setSimulationEnded(false)
            tickCount = 0;
          }
        }
      })
      .on('end', () => {
        console.log('Simulation ended ')
        setIsLoading(false);
        tickCount = 0;
        fitView({ nodes: simulationNodes })
        !simulationEnded ? setSimulationEnded(true) : setSimulationEnded(false)
      })
    return () => {
      console.log('return simulation')
      setIsLoading(false);
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
