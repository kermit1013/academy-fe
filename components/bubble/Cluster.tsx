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
  return <div className="bg-red-300">{data.id}</div>;
};

export default Cluster;
