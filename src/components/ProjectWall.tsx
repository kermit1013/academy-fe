import React, { useCallback, useEffect, useState } from 'react';
import close_btn from '/public/close_btn.svg'

import "@blocknote/core/fonts/inter.css"
import "@blocknote/mantine/style.css"
import axios from 'axios';
import Editor from './Editor';

interface ProjectWallProps {
  isOpen: boolean
  onClose: () => void
}

interface Project {
    id: string | number;
    name: string;
    description: string;
  }


const ProjectWall: React.FC<ProjectWallProps> = ({ isOpen, onClose }) => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState({} as Project);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    useEffect(() => {
        getAllProjects()
      }, [])
      
      const getAllProjects = useCallback(
          async () => {
            const access_token = localStorage.getItem('access_token')
            if (!access_token) {
              return
            }
            const url = 'https://api.loudy.in/api/projects'
            try {
                const result = await axios.get(
                    url,
                    {
                      headers: {
                        Authorization: `Bearer ${access_token}`
                      }
                    }
                  )
              if (result.status === 200) {
                setProjects(result.data)
              }
            } catch (error) {
              console.error('Error fetching data:', error)
            }
          },
          []
        )

        const handleProjectClick = (project: Project) => {
            console.log(project)
            setSelectedProject(project);
            setIsEditorOpen(true);
          };

        
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <Editor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        project={selectedProject}
        isEditable={false}
      />
      <div className="bg-[#F9F6F5] p-12 w-5/6 h-[90%] rounded-lg relative overflow-auto">
        <button
          onClick={onClose}
          className="fixed right-[calc(10%-1rem)] top-[calc(10%-2rem)] flex h-8 w-8 items-center justify-center rounded-full border border-[#7B7C7B] bg-[#7B7C7B]/20 text-sm hover:bg-[#7B7C7B]/40 z-10"
        >
          <img src={close_btn} alt="" />
        </button>
        
        <div className="grid grid-cols-3 gap-6">
          {projects.map((project: Project, index) => (
            <div key={index} className="card bg-base-100 shadow-lg hover:cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105"
            onClick={() => handleProjectClick(project)}>
              <figure>
                <img
                  src="https://fastly.picsum.photos/id/20/3670/2462.jpg?hmac=CmQ0ln-k5ZqkdtLvVO23LjVAEabZQx2wOaT4pyeG10I"
                  alt="" />
              </figure>
              <div className="card-body">
                <h2 className="card-title font-sans">
                  {project.name}
                  <div className="badge badge-secondary">NEW</div>
                </h2>
                <p className="font-sans">{project.description}</p>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectWall