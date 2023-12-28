"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { message } from "antd";

const UserDataInit = () => {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const handleTypeUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };
  const handleNextStep = () => {
    if (userName == "") {
      messageApi.open({
        type: "warning",
        content: "請輸入名字!"
      });
      return;
    }
    localStorage.setItem("user_name", userName);
    router.push("think");
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-between gap-10 py-10">
      {contextHolder}
      <p></p>
      <p className="text-3xl font-bold">
        你好，歡迎一起來發想自主學習主題！ <br />
        首先，我們該怎麼稱呼你？
      </p>
      <div className="flex w-full justify-between px-20">
        <input
          type="text"
          className="w-1/2 rounded-xl border border-gray-400 pl-2 text-3xl"
          onChange={(event) => {
            handleTypeUserName(event);
          }}
        />
        <button
          className="rounded-xl border border-green-400 bg-green-200 p-4 text-2xl hover:border-2"
          onClick={handleNextStep}
        >
          下一步
        </button>
      </div>
    </div>
  );
};

export default UserDataInit;
