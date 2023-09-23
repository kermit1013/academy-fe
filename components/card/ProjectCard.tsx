import React from "react";
import TitleTag from "../tag/TitleTag";
import HashTag from "../tag/HashTag";
import Type1 from "../monster/type1";
import Type2 from "../monster/type2";
import Type3 from "../monster/type3";
import Type4 from "../monster/type4";
import { IProject } from "@/\btypes";

interface ProjectCardProps {
  index: number;
  project: IProject;
}

const ProjectCard = ({ index, project }: ProjectCardProps) => {
  // index && key = -1 為尚未擁有專案
  const bgColor =
    index % 4 === 0
      ? "bg-sky-600"
      : index % 4 === 1 || index === -1
      ? "bg-green-600"
      : index % 4 === 2
      ? "bg-orange-400"
      : "bg-pink-300";
  const monster =
    index % 4 === 0 || index === -1 ? <Type1 /> : index % 4 === 1 ? <Type2 /> : index % 4 === 2 ? <Type3 /> : <Type4 />;
  const JourneyCard_Class = `projectCard flex h-[375px] w-[290px] flex-shrink-0 flex-col items-start justify-start gap-3  overflow-hidden rounded-md ${bgColor} px-4 pt-5 hover:cursor-pointer`;

  return (
    <div key={project.id} className={JourneyCard_Class}>
      <TitleTag title="8週計畫" />
      <div className="z-10 flex w-full gap-2">
        {project.tags.map((tag) => {
          return <HashTag key={tag.id} id={tag.id} title={tag.name} />;
        })}
      </div>

      <div className=" relative h-full w-full ">
        {monster}
        <p className="absolute bottom-2 left-2  whitespace-pre-wrap text-3xl tracking-widest text-white">
          {project.name}
        </p>
      </div>
    </div>
  );
};

export default ProjectCard;
