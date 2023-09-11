import React from "react";

type TitleTagProps = {
  title: string;
};

const TitleTag = ({ title }: TitleTagProps) => {
  const txtColor = title == "新手計畫" ? "text-green-700" : "text-[#2F66B0]";
  return <div className={`z-10 w-full rounded-lg bg-white px-3 py-1 text-center ${txtColor}`}>{title}</div>;
};

export default TitleTag;
