"use client";
import React, { useEffect, useState } from "react";
import ProjectCard from "@/components/card/ProjectCard";
import { projectsApi } from "@/lib/api";
import { IProject } from "@/\btypes";
import { useRouter } from "next/navigation";

const getProjects = async () => {
  const data = await projectsApi.getAllProjects();
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

const Project = () => {
  const router = useRouter();
  router.push("/start");
  return;
  const [projects, setProjects] = useState<IProject[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getProjects();
      setProjects(data);
    };

    fetchProjects();
  }, []);

  return (
    <div className="flex flex-wrap justify-start gap-3 px-9 py-10">
      {projects.length > 0 ? (
        projects.map((project, index) => <ProjectCard index={index} key={project.id} project={project} />)
      ) : (
        <ProjectCard index={-1} key={-1} project={initProject[0]} />
      )}
    </div>
  );
};

export default Project;
