import React, { useState, useEffect, useCallback, useRef } from 'react'
import close_btn from '/public/close_btn.svg'
import '@blocknote/core/fonts/inter.css'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import { Block } from '@blocknote/core'
import useEditor from '../hooks/useEditor'
import { message } from 'antd'
import { saveAs } from 'file-saver'
import icon_doc from '/public/icons/icon_doc.svg'
import {
  ExportProject,
  GetProject,
  NewBlockNote,
  UpdateProject
} from '../libs/api/project'

interface EditorProps {
  isOpen: boolean
  projectId: string
  isEditable: boolean
  nodeId?: string
}

const Editor: React.FC<EditorProps> = ({ isOpen, projectId, nodeId }) => {
  const [messageApi, contextHolder] = message.useMessage()
  const [blocks, setBlocks] = useState<Block[]>([])
  const saveTimeoutRef = useRef<number | null>(null)
  const { setIsOpen, setProjectId, setNodeId, editable } = useEditor()
  const [isExporting, setIsExporting] = useState(false)

  const editor = useCreateBlockNote({
    uploadFile: async (file: File) => {
      const access_token = localStorage.getItem('access_token')
      if (!access_token) {
        return { url: '' }
      }
      console.log('Uploading file:', file)
      if (file.size > 1 * 1024 * 1024) {
        // 1MB in bytes
        messageApi.warning('檔案上傳大小上限為1MB')
        return { url: '' }
      }

      const formData = new FormData()
      formData.append('file', file)
      const result = await NewBlockNote(formData)
      if (result.status === 200) {
        return { url: result.url }
      } else {
        return { url: '' }
      }
    },
    initialContent: [
      {
        type: 'paragraph',
        content: 'Loading content...'
      }
    ]
  })

  const getProject = useCallback(async () => {
    if (!projectId && !nodeId) {
      console.log('Project or project ID is not available')
      return
    }
    const access_token = localStorage.getItem('access_token')
    if (!access_token) {
      return
    }

    GetProject(nodeId, projectId)
      .then((result) => {
        editor.replaceBlocks(editor.document, result.content)
        setBlocks(result.content)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }, [projectId, editor, nodeId])

  useEffect(() => {
    if (isOpen) {
      getProject()
    }

    // Clear any pending save operations when component unmounts or closes
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [isOpen, getProject])

  const saveContent = useCallback(
    async (content: Block[]) => {
      if (!editable) return
      UpdateProject(content, projectId)
        .then(() => {
          console.log('project saved!')
        })
        .catch((error: any) => {
          console.error('Error saving data:', error)
        })
    },
    [projectId, editable]
  )

  const debouncedSave = useCallback(
    (content: Block[]) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      saveTimeoutRef.current = window.setTimeout(() => {
        saveContent(content)
      }, 1000)
    },
    [saveContent]
  )

  const handlerCloseEditor = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    editor.replaceBlocks(editor.document, [])
    setIsOpen(false)
    setProjectId('')
    setNodeId('')
  }

  const handlerExport = async () => {
    const content = (await editor.blocksToHTMLLossy()).toString()
    setIsExporting(true)
    ExportProject(content)
      .then((result) => {
        saveAs(result, 'exported_project.docx')
        console.log('Project exported successfully!')
      })
      .catch((error) => {
        console.error('Error exporting project:', error)
        messageApi.error('Export failed. Please try again.')
      })
      .finally(() => {
        setIsExporting(false)
      })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {contextHolder}
      <div className="relative h-[90%] w-5/6 overflow-auto rounded-lg bg-[white] p-12">
        <BlockNoteView
          theme={'light'}
          editor={editor}
          onChange={() => {
            console.log(blocks)
            debouncedSave(editor.document)
            setBlocks(editor.document)
          }}
          editable={editable}
        />
        {editable && (
          <button
            onClick={handlerExport}
            disabled={isExporting}
            className={`fixed right-[calc(10%+2rem)] top-[calc(10%-2rem)] flex h-8 w-8 items-center justify-center rounded-full border border-[#7B7C7B] ${
              isExporting
                ? 'cursor-not-allowed bg-[#7B7C7B]/10'
                : 'bg-[#7B7C7B]/20 hover:bg-[#7B7C7B]/40'
            } z-10 text-sm`}
          >
            <img src={icon_doc} alt="" />
          </button>
        )}

        <button
          onClick={handlerCloseEditor}
          className="fixed right-[calc(10%-1rem)] top-[calc(10%-2rem)] z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#7B7C7B] bg-[#7B7C7B]/20 text-sm hover:bg-[#7B7C7B]/40"
        >
          <img src={close_btn} alt="" />
        </button>
      </div>
    </div>
  )
}

export default Editor
