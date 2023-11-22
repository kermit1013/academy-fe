"use client";

import React, { useState } from "react";
import { PlusOutlined, LeftOutlined } from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/store/rootStore";
const Topbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [yearName, setYearName] = useState("112年上學期");
  const [topicName, setTopicName] = useState("生成中…");
  const [targetName, setTargetName] = useState("生成中…");

  const { type: stepType, name: stepThemeName, nextName: stepActiontName } = useStore((state) => state.currentStepInfo);
  const steps = useStore((state) => state.allStepStatus[stepType]);

  const back2Home = () => {
    router.push("/");
  };
  return (
    <div
      className={`absolute right-0 flex h-24 ${
        pathname === "/" ? "w-[calc(100vw-80px)]" : "w-full"
      } items-center justify-between gap-4 border-b-2 border-gray-200  p-4`}
    >
      {pathname === "/" ? (
        <div className="flex w-full justify-end">
          {" "}
          <button
            className="flex h-14 w-32 items-center justify-center gap-4 rounded-md bg-black text-white"
            onClick={() => {
              router.push("/buildproject");
            }}
          >
            <button
              onClick={() => {
                router.push("/");
              }}
            >
              <PlusOutlined />
            </button>
            <p>新專案</p>
          </button>
        </div>
      ) : (
        <div className="flex h-full w-full  items-center ">
          <LeftOutlined
            className="mr-4 rounded-full p-2 text-[32px] hover:bg-gray-50"
            onClick={() => {
              back2Home();
            }}
          />
          <div className="flex  h-full w-full items-center justify-between ">
            <p className="flex h-11 items-center rounded-md bg-black px-6 text-center text-white">{yearName}</p>

            <div className="flex items-center">
              <span className="rounded-md bg-orange-500 p-2 text-white">主題</span>
              <p className="m-3 text-gray-400">{topicName}</p>
            </div>

            <div className="flex items-center">
              <span className="rounded-md bg-blue-500 p-2 text-white">目標</span>
              <p className="m-3 text-gray-400">{targetName}</p>
            </div>

            <div className="flex h-full w-full max-w-[490px] rounded-r-md font-bold text-white">
              <div className="flex h-full items-center whitespace-nowrap rounded-l-md bg-black p-2">
                {stepThemeName}
              </div>

              <div className="relative flex w-full items-center justify-between gap-10 overflow-hidden rounded-r-md border-2 border-black p-1 pl-8  before:absolute before:-z-10 before:h-1 before:w-[90%] before:border-2 before:border-dashed before:border-gray-300 before:text-black before:content-['']">
                {steps.map((bool, index) => {
                  const className = `w-11 rounded-md p-1 text-center ${bool ? "bg-green-400" : "bg-gray-300 "}`;
                  const idx = index + 1;
                  return (
                    <span key={idx} className={className}>
                      {idx}
                    </span>
                  );
                })}

                <button
                  disabled={steps.at(-1) === false}
                  className={`h-full w-[136px] rounded-md ${steps.at(-1) ? "bg-black" : "bg-gray-300"}`}
                >
                  前往{stepActiontName}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topbar;
