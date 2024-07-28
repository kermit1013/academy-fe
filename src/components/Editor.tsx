import React, { useState, useEffect, useCallback, useRef } from 'react';
import close_btn from '/public/close_btn.svg'
import "@blocknote/core/fonts/inter.css"
import { useCreateBlockNote } from "@blocknote/react"
import { BlockNoteView } from "@blocknote/mantine"
import "@blocknote/mantine/style.css"
import { Block } from "@blocknote/core";
import axios from 'axios'
import useEditor from '../hooks/useEditor';
import { message } from 'antd'
import { saveAs } from "file-saver";
import icon_doc from "/public/icons/icon_doc.svg"

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
  const [isExporting, setIsExporting] = useState(false);

  const editor = useCreateBlockNote({
    uploadFile: async (file: File) => {
      const access_token = localStorage.getItem('access_token')
      if (!access_token) {
        return { url: '' };
      }
      console.log('Uploading file:', file);
      if (file.size > 1 * 1024 * 1024) { // 1MB in bytes
        messageApi.warning('檔案上傳大小上限為1MB');
        return { url: '' };
      }

      const formData = new FormData();
      formData.append('file', file);
      try {
        const result = await axios.post('https://api.loudy.in/api/projects/files', formData,
          {
            headers: {
              Authorization: `Bearer ${access_token}`
            }
          }
        )
        if (result.status === 200) {
          return result.data.url
        }
      } catch (error) {
        console.error('Error uploading file:', error)
        return ''
      }
    },
    initialContent: [
      {
        type: "paragraph",
        content: "Loading content...",
      }
    ],
  });

  const getProject = useCallback(async () => {
    if (!projectId && !nodeId) {
      console.log('Project or project ID is not available')
      return
    }
    const access_token = localStorage.getItem('access_token')
    if (!access_token) {
      return
    }
    try {
      const result = await axios.get(nodeId ? `https://api.loudy.in/api/projects/nodes/${nodeId}` :
        `https://api.loudy.in/api/projects/${projectId}`,
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
    };
  }, [isOpen, getProject])

  const saveContent = useCallback(async (content: Block[]) => {
    const access_token = localStorage.getItem('access_token')
    if (!access_token) {
      return
    }
    try {
      const result = await axios.put(
        `https://api.loudy.in/api/projects/${projectId}`,
        {
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
  }, [projectId])

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
    setIsOpen(false)
    setProjectId('')
    setNodeId('')
  }

  const handlerExport = async () => {
    const access_token = localStorage.getItem('access_token')
    const content = (await editor.blocksToHTMLLossy()).toString();
    setIsExporting(true);
    try {
      const response = await axios({
        method: 'post',
        url: 'https://api.loudy.in/api/projects/docx',
        data: {
          html: content
        },
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
        responseType: 'blob'
      });

      saveAs(response.data, 'exported_project.docx');
      console.log('Project exported successfully!');
    } catch (error) {
      console.error('Error exporting project:', error);
      messageApi.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {contextHolder}
      <div className="bg-[white] p-12 w-5/6 h-[90%] rounded-lg relative overflow-auto ">
        <BlockNoteView theme={"light"} editor={editor}
          onChange={() => {
            console.log(editor.document)
            debouncedSave(editor.document)
            setBlocks(editor.document)
          }}
          editable={editable}
        />
        <button
          onClick={handlerExport}
          disabled={isExporting}
          className={`fixed right-[calc(10%+2rem)] top-[calc(10%-2rem)] flex h-8 w-8 items-center justify-center rounded-full border border-[#7B7C7B] ${isExporting ? 'bg-[#7B7C7B]/10 cursor-not-allowed' : 'bg-[#7B7C7B]/20 hover:bg-[#7B7C7B]/40'
            } text-sm z-10`}
        >
          <img src={icon_doc} alt="" />
        </button>
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