import React from "react";
interface props {
  data: {
    id: string;
    label: string;
    position: {
      x: number;
      y: number;
    };
    parentNode: string;
    level: number;
  };
}
const Cluster = ({ data }: props) => {
  return <div className=" z-50 h-40 w-72 rounded-sm border-2 border-black">{data.id}</div>;
};

export default Cluster;
