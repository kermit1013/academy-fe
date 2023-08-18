"use client";

import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
const Topbar = () => {
  const router = useRouter();
  const isLogin = false;
  if (!isLogin) {
    return <></>;
  }
  return (
    <div
      className={
        "absolute right-0 flex h-24 w-[calc(100vw-80px)] items-center justify-between gap-4 border-b-2 border-gray-200  p-4"
      }
    >
      <p className="text-2xl font-bold">首頁/建立你的第一個專案</p>
      <button
        className="flex h-14 w-32 items-center justify-center gap-4 rounded-md bg-black text-white"
        onClick={() => {
          router.push("/buildproject");
        }}
      >
        <PlusOutlined />
        <p>新專案</p>
      </button>
    </div>
  );
};

export default Topbar;
