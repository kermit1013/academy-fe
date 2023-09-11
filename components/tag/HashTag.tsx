"use client";
import React from "react";

type HashTagProps = {
  id: number;
  title: string;
};

const HashTag = (props: HashTagProps) => {
  return (
    <div
      key={props.id}
      className="w-full rounded-lg border-2 border-white bg-transparent px-3 py-1  text-center text-white  "
    >
      {props.title}
    </div>
  );
};

export default HashTag;
