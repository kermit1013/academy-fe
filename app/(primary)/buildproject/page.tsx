"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import card_haveidea from "../../../public/card_haveidea.svg";
import card_noidea from "../../../public/card_noidea.svg";
const BuildProject = () => {
  const router = useRouter();
  const bigContentClass =
    "hover:ease-in-out rounded-xl flex h-[431px] w-[393px] shrink flex-col items-center justify-between gap-2 overflow-hidden rounded-lg hover:scale-105 hover:transition-transform hover:duration-150 hover:cursor-pointer text-white";
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8  p-8">
      <p className="text-4xl font-bold">
        <a href="" className="underline decoration-2 hover:decoration-wavy">
          使用者名稱
        </a>
        <span>{", "}</span>
        <span>你對自主學習…</span>
      </p>

      <div className="flex w-full shrink  justify-center justify-items-center gap-8 self-center  ">
        <div
          className={`${bigContentClass} bg-[#EC7F49]`}
          onClick={() => {
            router.push("/newjourney");
          }}
        >
          <p className="mt-8 text-4xl font-bold">毫無想法</p>
          <p className="text-3xl font-thin"> 讓我們一起探索吧！</p>
          <Image src={card_noidea} alt="" />
        </div>
        <div
          className={`${bigContentClass} bg-[#30A549]`}
          onClick={() => {
            router.push("/exploretheme");
          }}
        >
          <p className="mt-8 text-4xl font-bold">已經有明確的想法</p>
          <p className="text-3xl font-thin"> 建立你的計畫吧！</p>
          <Image src={card_haveidea} alt="" />
        </div>
      </div>
    </div>
  );
};

export default BuildProject;
