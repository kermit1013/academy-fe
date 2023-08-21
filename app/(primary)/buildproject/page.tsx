import React from "react";
import Image from "next/image";
const BuildProject = () => {
  return (
    <div className="absolute left-20 top-24  h-[calc(100vh-96px)] w-[calc(100vw-80px)]  ">
      <div className="flex h-full w-full flex-col items-center justify-center gap-8  p-8">
        <p className="text-4xl font-bold">
          <a href="" className="underline decoration-2 hover:decoration-wavy">
            使用者名稱
          </a>
          <span>,</span>
          <a href="" className="underline decoration-2 hover:decoration-wavy">
            網頁名稱
          </a>
          <span>想請問你對學習計畫…</span>
        </p>

        <div className="flex w-full shrink  justify-center justify-items-center gap-8 self-center  ">
          <div className="hover:ease-in-outrounded-xl flex h-[488px] w-[430px] shrink flex-col items-center justify-center  gap-8 rounded-lg border-2 border-black hover:scale-105 hover:transition-transform hover:duration-150 ">
            <Image
              width={494}
              height={612}
              src="/no_idea.jpeg"
              alt=""
              className="h-48 w-32 rounded-lg object-contain"
            />
            <p className="text-4xl font-bold">毫無想法</p>
          </div>

          <div className="hover:ease-in-outrounded-xl flex h-[488px] w-[430px] shrink flex-col items-center justify-center  gap-8 rounded-lg border-2 border-black hover:scale-105 hover:transition-transform hover:duration-150 ">
            <Image
              width={500}
              height={318}
              src="/have_idea.jpeg"
              alt=""
              className="h-48 w-48 rounded-lg object-contain"
            />
            <p className="text-4xl font-bold">已經有明確的想法</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildProject;
