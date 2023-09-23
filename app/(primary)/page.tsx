import React from "react";
import ProjectCard from "@/components/card/ProjectCard";
import { projectsApi } from "@/lib/api";
import { IProject } from "@/\btypes";

const getProjects = () => {
  const data = projectsApi.getAllProjects();
  return data;
};

const initProject: IProject[] = [
  {
    id: 1,
    tags: [
      { id: 1, name: "#標籤", color: "" },
      { id: 2, name: "#標籤", color: "" },
      { id: 3, name: "#標籤", color: "" }
    ],
    journey_id: 1,
    name: "建立你的第一個專案"
  }
];

const Project = async () => {
  const projects = await getProjects();
  const projectList = projects.length > 0 ? projects : initProject;

  return (
    <div className="flex flex-wrap justify-start gap-3 ">
      {projectList.map((project, index) => {
        return <ProjectCard index={index} key={project.id} project={project} />;
      })}
    </div>
  );
};

export default Project;
