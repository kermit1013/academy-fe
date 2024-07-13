import React, { useMemo, useEffect } from 'react';
import close_btn from '/public/close_btn.svg'

import "@blocknote/core/fonts/inter.css"
import { useCreateBlockNote } from "@blocknote/react"
import { BlockNoteView } from "@blocknote/mantine"
import "@blocknote/mantine/style.css"

interface EditorProps {
  isOpen: boolean
  onClose: () => void
}

const Editor: React.FC<EditorProps> = ({ isOpen, onClose }) => {

  const editor = useCreateBlockNote();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-12 w-4/5 h-4/5 rounded-lg relative overflow-auto ">
      <BlockNoteView theme={"light"} editor={editor} />
        <button
        onClick={onClose}
        className="fixed right-[calc(10%+1rem)] top-[calc(10%+0.5rem)] flex h-8 w-8 items-center justify-center rounded-full border border-[#7B7C7B] bg-[#7B7C7B]/20 text-sm hover:bg-[#7B7C7B]/40 z-10"
      >
        <img src={close_btn} alt="" />
      </button>
      </div>
    </div>
  );
};

export default Editor