import React from "react";
import JourneyCard from "@/components/card/JourneyCard";
import { IJourney } from "@/\btypes/journey";

const Journey = () => {
  const journeyList: IJourney[] = Array.from({ length: 5 }, (_, index) => ({
    id: index + 1,
    name: "霹靂卡霹靂拉拉貝貝魯多",
    user_id: 10,
    planTag: "8週計畫",
    tags: [
      { id: 1, name: "#標籤", color: "" },
      { id: 2, name: "#標籤", color: "" },
      { id: 3, name: "#標籤", color: "" }
    ],
    created_date: "2023/08/18",
    created_by: "Jacob",
    last_modified_date: "2023/08/18",
    last_modified_by: "Jacob"
  }));

  const newJorney: IJourney = {
    id: 1,
    name: "建立你的\n第一個專案",
    user_id: 10,
    planTag: "新手計畫",
    tags: [
      { id: 1, name: "#標籤", color: "" },
      { id: 2, name: "#標籤", color: "" },
      { id: 3, name: "#標籤", color: "" }
    ],
    created_date: "",
    created_by: "",
    last_modified_date: "",
    last_modified_by: ""
  };

  return (
    <div className="contentPage overflow-y-scroll bg-[url('../public/bg_dashboard_grid.svg')] bg-cover bg-repeat p-11">
      <div className="flex flex-wrap justify-start gap-3 ">
        {journeyList.length === 0 ? (
          <JourneyCard index={-1} key={-1} journey={newJorney} />
        ) : (
          journeyList.map((journey, index) => {
            return <JourneyCard index={index} key={journey.id} journey={journey} />;
          })
        )}
      </div>
    </div>
  );
};

export default Journey;
