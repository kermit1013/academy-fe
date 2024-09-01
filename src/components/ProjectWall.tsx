import React, { useCallback, useEffect, useState } from 'react'
import close_btn from '/public/close_btn.svg'
import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'
import useEditor from '../hooks/useEditor'
import { GetProjectList } from '../libs/api/project'

interface ProjectWallProps {
  isWallOpen: boolean
  onClose: () => void
}

interface Project {
  id: string | number
  name: string
  description: string
  imagePath: string
  created_at: string
}

const ProjectWall: React.FC<ProjectWallProps> = ({ isWallOpen, onClose }) => {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const { setIsOpen, setProjectId, setEditable } = useEditor()

  useEffect(() => {
    getAllProjects()
  }, [])

  const getAllProjects = useCallback(async () => {
    const access_token = localStorage.getItem('access_token')
    if (!access_token) {
      return
    }
    GetProjectList()
      .then((result) => {
        const projectsWithImages = result.map((project: Project) => ({
          ...project,
          imagePath: `/project_covers/project_${Math.floor(Math.random() * 10) + 1}.webp`
        }))
        setProjects(projectsWithImages)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }, [])

  const handleProjectClick = (project: Project) => {
    console.log(project)
    setProjectId(project.id.toString())
    setIsOpen(true)
    setEditable(false)
  }

  const isNewProject = (createdAt: string) => {
    const projectDate = new Date(createdAt)
    const currentDate = new Date()
    const diffTime = Math.abs(currentDate.getTime() - projectDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 3
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isWallOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative h-[90%] w-5/6 overflow-auto rounded-lg bg-[#F9F6F5] p-12">
        <button
          onClick={onClose}
          className="fixed right-[calc(10%-1rem)] top-[calc(10%-2rem)] z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#7B7C7B] bg-[#7B7C7B]/20 text-sm hover:bg-[#7B7C7B]/40"
        >
          <img src={close_btn} alt="" />
        </button>

        <div className="mb-6">
          <input
            type="text"
            placeholder="想搜尋什麼專案..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full p-2 font-sans"
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          {filteredProjects.map((project: Project, index) => (
            <div
              key={index}
              className="card bg-base-100 shadow-lg transition-transform duration-200 ease-in-out hover:scale-105 hover:cursor-pointer"
              onClick={() => handleProjectClick(project)}
            >
              <figure className="h-48 overflow-hidden">
                <img
                  src={project.imagePath}
                  alt={project.name}
                  className="h-full w-full object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title font-sans">
                  {project.name}
                  {isNewProject(project.created_at) && (
                    <span className="badge bg-[#6CA579] text-white">NEW</span>
                  )}
                </h2>
                <p className="font-sans">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectWall
