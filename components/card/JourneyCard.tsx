import React from "react";
import TitleTag from "../tag/TitleTag";
import HashTag from "../tag/HashTag";
import { IJourney } from "@/\btypes/journey";

interface props {
  journey: IJourney;
}

const JourneyCard = ({ journey }: props) => {
  return (
    <div
      key={journey.id}
      className="box-content flex h-80 w-72 flex-shrink-0 flex-col items-start justify-between rounded-md border-2 border-black p-4 hover:cursor-pointer hover:bg-gray-100"
    >
      <TitleTag title={journey.planTag} />
      <div className="flex flex-col gap-2">
        <p className="text-3xl font-bold">{journey.name}</p>
        <div className="flex ">
          {journey.tags.map((tag) => {
            return <HashTag key={tag.id} id={tag.id} title={tag.name} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default JourneyCard;
