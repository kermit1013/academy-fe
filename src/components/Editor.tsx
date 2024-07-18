import React, { useState, useEffect, useCallback, useRef } from 'react';
import close_btn from '/public/close_btn.svg'

import "@blocknote/core/fonts/inter.css"
import { useCreateBlockNote } from "@blocknote/react"
import { BlockNoteView } from "@blocknote/mantine"
import "@blocknote/mantine/style.css"
import { Block } from "@blocknote/core";
import axios from 'axios'

interface Project {
  id: string | number
  name: string;
  // Add other properties as needed
}

interface EditorProps {
  isOpen: boolean
  onClose: () => void
  project: Project
  isEditable: boolean
}

const Editor: React.FC<EditorProps> = ({ isOpen, onClose, project, isEditable }) => {
  const [blocks, setBlocks] = useState<Block[]>([])
  const saveTimeoutRef = useRef<number | null>(null)

  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
        content: "Loading content...",
      }
    ],
  });

  const getProject = useCallback(async () => {
    if (!project || !project.id) {
      console.log('Project or project ID is not available')
      return
    }
    const access_token = localStorage.getItem('access_token')
    if (!access_token) {
      return
    }
    try {
      const result = await axios.get(
        `https://api.loudy.in/api/projects/${project.id}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        }
      )
      if (result.status === 200) {
        console.log(blocks)
        console.log(result.data.content)
        editor.replaceBlocks(editor.document, result.data.content)
        setBlocks(result.data.content)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }, [project, editor])

  useEffect(() => {
    if (isOpen) {
      getProject()
    } 
    
    // Clear any pending save operations when component unmounts or closes
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    };
  }, [isOpen, getProject])

  const saveContent = useCallback(async (content: Block[]) => {
    const access_token = localStorage.getItem('access_token')
    if (!access_token) {
      return
    }
    try {
      const result = await axios.put(
        `https://api.loudy.in/api/projects/${project.id}`,
        {
          name: project.name,
          content: content
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        }
      )
      if (result.status === 200) {
        console.log('project saved!')
      }
    } catch (error) {
      console.error('Error saving data:', error)
    }
  }, [project])

  const debouncedSave = useCallback((content: Block[]) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = window.setTimeout(() => {
      saveContent(content)
    }, 1000)
  }, [saveContent])

  const handlerCloseEditor = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    editor.replaceBlocks(editor.document, [])
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[white] p-12 w-5/6 h-[90%] rounded-lg relative overflow-auto ">
        <BlockNoteView theme={"light"} editor={editor}
          onChange={() => {
            console.log(editor.document)
            debouncedSave(editor.document)
            setBlocks(editor.document)
          }}
          editable={isEditable}
        />
        <button
          onClick={handlerCloseEditor}
          className="fixed right-[calc(10%-1rem)] top-[calc(10%-2rem)] flex h-8 w-8 items-center justify-center rounded-full border border-[#7B7C7B] bg-[#7B7C7B]/20 text-sm hover:bg-[#7B7C7B]/40 z-10"
        >
          <img src={close_btn} alt="" />
        </button>
      </div>
    </div>
  );
};

export default Editor