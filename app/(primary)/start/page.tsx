"use client";
import { useRouter } from "next/navigation";
import React from "react";

const StartPage = () => {
  const router = useRouter();
  const handleChangePath = () => {
    router.push("/init");
  };
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-between gap-10 py-10">
      <p className="text-3xl font-bold">Loudy</p>
      <p className="text-3xl font-bold">高中生自主學習發想工具</p>
      <button
        className="rounded-xl border border-green-400 bg-green-200 p-4 text-2xl hover:border-2"
        onClick={handleChangePath}
      >
        開始發想
      </button>
    </div>
  );
};

export default StartPage;
