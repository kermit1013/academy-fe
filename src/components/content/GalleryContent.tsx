import disconnect from '/public/exit.svg'
import prev_button from '/public/swipe-left.svg'
import next_button from '/public/swipe-right.svg'
import useTopMenuStore from '../../stores/useTopMenuStore'

interface GalleryContentProps {
  getPersonData: (type: number) => Promise<void>
  setActionType: React.Dispatch<React.SetStateAction<number>>
}

const GalleryContent: React.FC<GalleryContentProps> = ({
  getPersonData,
  setActionType
}) => {
  const { setIsOpenGalleryContent } = useTopMenuStore()

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
    <>
      <div className="flex items-center justify-center pb-5">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlerMoveBtn(-1)}
            className="z-10 flex h-10 w-10 items-center justify-center rounded border border-[#EF6E52]/20 bg-[#EF6E52]/20 p-1"
          >
            <img src={prev_button} alt="" />
          </button>
          <div className="z-10 flex h-10 w-fit items-center justify-center rounded border border-[#EF6E52]/20 bg-[#EF6E52]/20 p-1 px-2 py-1">
            <p className="font-sans text-[13px] text-[#EF6E52]">
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
          <button
            onClick={() => handlerMoveBtn(1)}
            className="z-10 flex h-10 w-10 items-center justify-center rounded border border-[#EF6E52]/20 bg-[#EF6E52]/20 p-1"
          >
            <img src={next_button} alt="" />
          </button>
        </div>
      </div>
    </>
  )
}

export default GalleryContent
