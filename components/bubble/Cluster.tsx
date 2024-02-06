import React from "react";
interface props {
  data: {
    id: string;
    label: string;
    position: {
      x: number;
      y: number;
    };
    center_id: string;
    parentNode: string;
    level: number;
  };
}
const Cluster = ({ data }: props) => {
  return (
    <div className="z-50 flex h-44 w-44 items-center justify-center overflow-hidden rounded-[50px] border-2 text-center"></div>
  );
};

export default Cluster;
