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
      className="mr-2 rounded-lg border-2 border-red-400 bg-red-300 px-3  py-1 text-white hover:bg-red-500"
    >
      {props.title}
    </div>
  );
};

export default HashTag;
