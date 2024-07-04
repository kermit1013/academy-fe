import { useReactFlow, useViewport } from 'reactflow'

const CustomZoom = () => {
  const { zoomIn, zoomOut } = useReactFlow()
  const getViewport = useViewport()

  return (
    <data className="flex items-end justify-center gap-2 rounded-md border border-[#7B7C7B]/20">
      <div className="flex h-7 w-fit items-center justify-center gap-1 rounded-lg bg-[#7B7C7B]/10 text-[#7B7C7B]">
        <button className="p-2" onClick={() => zoomOut({ duration: 800 })}>
          -
        </button>
        <p className="border-l border-r border-[#7B7C7B] px-2">
          {Math.floor(getViewport.zoom * 100)}%
        </p>
        <button className="p-2" onClick={() => zoomIn({ duration: 800 })}>
          +
        </button>
      </div>
    </data>
  )
}

export default CustomZoom
