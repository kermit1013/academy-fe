import React from "react";
import Image from "next/image";
const BuildProject = () => {
  return (
    <div className="absolute left-20 top-24 flex h-[calc(100vh-96px)] w-[calc(100vw-80px)] flex-col items-center justify-center gap-8 p-11">
      <p className="text-4xl font-bold">
        <span className="underline">使用者名稱</span>
        <span>,</span>
        <span className="underline">網頁名稱</span>
        <span>想請問你對學習計畫…</span>
      </p>
      <div className="flex justify-items-center gap-8">
        <div className="flex h-[488px] w-[430px] flex-col items-center justify-center gap-8  rounded-xl border-2 border-black ">
          <Image
            width={32}
            height={32}
            src="/bg_login.jpeg"
            alt=""
            className="h-32 w-32 rounded-lg"
          />
          <p className="text-4xl font-bold">毫無想法</p>
        </div>

        <div className="flex h-[488px] w-[430px] flex-col items-center justify-center gap-8  rounded-xl border-2 border-black ">
          <Image
            width={32}
            height={32}
            src="/bg_login.jpeg"
            alt=""
            className="h-32 w-32 rounded-lg"
          />
          <p className="text-4xl font-bold">已經有明確的想法</p>
        </div>
      </div>
    </div>
  );
};

export default BuildProject;
