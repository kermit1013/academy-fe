import disconnect from '/public/disconnect.svg'
import prev_button from '/public/prev_button.svg'
import next_button from '/public/next_button.svg'
import useTopMenu from '../../hooks/useTopMenu'

interface GalleryContentProps {
  getPersonData: (type: number) => Promise<void>
  setActionType: React.Dispatch<React.SetStateAction<number>>
}

const GalleryContent: React.FC<GalleryContentProps> = ({
  getPersonData,
  setActionType
}) => {
  const { setIsOpenGalleryContent } = useTopMenu()

  const handlerMoveBtn = (action_type: number) => {
    setActionType(action_type)
    getPersonData(action_type)
  }

  const handlerLeaveGallery = () => {
    if (localStorage.getItem('gallery_user_id')) {
      getPersonData(0)
    } 
    setIsOpenGalleryContent(false)
    localStorage.removeItem('gallery_user_id')
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      <div className="flex h-full w-full items-center justify-between">
        <button
          onClick={() => handlerMoveBtn(-1)}
          className="z-10 flex h-10 w-10 items-center justify-center rounded border border-[#7B7C7B] hover:bg-[#7B7C7B]/10"
        >
          <img src={prev_button} alt="" />
        </button>
        <button
          onClick={() => handlerMoveBtn(1)}
          className="z-10 flex h-10 w-10 items-center justify-center rounded border border-[#7B7C7B] hover:bg-[#7B7C7B]/10"
        >
          <img src={next_button} alt="" />
        </button>
      </div>
      <div className="z-10 flex h-10 w-fit items-center justify-center rounded border border-[#7B7C7B]/20 bg-[#7B7C7B]/10 px-2 py-1">
        <p className="font-sans text-[13px] text-[#7B7C7B]">
          按左右鍵可以逛逛他人的心智圖
        </p>
        <p className="ml-2 h-full w-1 border-l border-[#7B7C7B]"></p>
        <button
          className="hover:scale-110"
          onClick={() => handlerLeaveGallery()}
        >
          <img src={disconnect} alt="" />
        </button>
      </div>
    </div>
  )
}

export default GalleryContent
