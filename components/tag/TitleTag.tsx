import React from "react";

type TitleTagProps = {
  title: string;
};

const TitleTag = (props: TitleTagProps) => {
  return (
    <div className="rounded-full border-2 border-red-400 bg-red-300 px-3 py-1 text-white hover:bg-red-500">
      {props.title}
    </div>
  );
};

export default TitleTag;
