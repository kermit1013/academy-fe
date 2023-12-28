"use client";
import React, { useState } from "react";
import { message } from "antd";
import axios from "axios";
import useClusterPosition from "@/hooks/useClusterPosition";
import { QRCode } from "antd";
import { useRouter } from "next/navigation";
import { Image } from "antd";
interface QList {
  Q1: string;
  Q2: string;
  Q3: string;
  Q4: string;
  Q5: string;
  Q6: string;
  Q7: string;
  Q8: string;
  Q9: string;
}

const Share = () => {
  const { imgUrl } = useClusterPosition();
  const router = useRouter();
  const handleDownload = () => {
    const a = document.createElement("a");

    a.setAttribute("download", "reactflow.png");
    a.setAttribute("href", imgUrl);
    a.click();
  };
  setTimeout(() => {
    router.push("/start");
  }, 15000);
  return (
    <div className="flex  h-screen w-screen flex-col items-center justify-center bg-black/50">
      <div className="flex h-fit w-3/5 flex-col gap-10 rounded-lg bg-white bg-gradient-to-r from-sky-500/30 to-indigo-500/30 p-14">
        <p className="text-center text-4xl font-bold">祝你自主學習順利喔！</p>
        <div className="flex  items-center justify-center gap-10">
          <Image width={384} src={imgUrl} alt="screenshot" />
          <div className="flex h-full flex-col justify-between gap-2">
            <button
              className=" rounded-md border-2 bg-blue-100 p-2 text-xl font-bold  hover:bg-blue-200"
              onClick={handleDownload}
            >
              下載你的發想成果
            </button>
            <button className=" rounded-md border-2 bg-blue-100 p-2 text-xl font-bold hover:bg-blue-200">
              分享此網站給朋友
            </button>
            <div className="flex items-center gap-5">
              <QRCode type="canvas" value="https://www.instagram.com/return_inn/" />
              <QRCode type="canvas" value="https://discord.gg/m3JK5h4R" />
              <p className=" text-xl font-bold">追蹤轉屋IG</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Result = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { imgUrl, MyRoomId } = useClusterPosition();
  const [userMail, setUserMail] = useState("");

  const [isShare, setIsShare] = useState(false);
  const [Q1, SetQ1] = useState("");
  const [Q2, SetQ2] = useState("");
  const [Q3, SetQ3] = useState("");
  const [Q4, SetQ4] = useState("");
  const [Q5, SetQ5] = useState("");
  const [Q6, SetQ6] = useState("");
  const [Q7, SetQ7] = useState("");
  const [Q8, SetQ8] = useState("");
  const [Q9, SetQ9] = useState("");
  const handleSubmit = async () => {
    if (userMail !== "") {
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const result = re.test(String(userMail).toLowerCase());
      if (!result) {
        messageApi.open({
          type: "warning",
          content: "信箱格式錯誤!"
        });
        return;
      }
    }

    if (Q1 == "" && Q2 == "" && Q3 == "" && Q4 == "" && Q5 == "" && Q6 == "" && Q7 == "" && Q8 == "" && Q9 == "") {
      messageApi.open({
        type: "warning",
        content: "請至少選擇一個題目回答，感謝~~"
      });
      return;
    }
    const list: QList = {
      Q1,
      Q2,
      Q3,
      Q4,
      Q5,
      Q6,
      Q7,
      Q8,
      Q9
    };
    const data = {
      room: MyRoomId,
      username: localStorage.getItem("user_name"),
      screenShot: imgUrl,
      email: userMail,
      feedback: JSON.stringify(list)
    };
    console.log(data);
    const res = await axios.post("https://api.loudy.in/result", data, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (res.status === 200) {
      messageApi.open({
        type: "success",
        content: "已送出!"
      });
    }
    localStorage.removeItem("user_name");
    localStorage.removeItem("center");
    setIsShare(true);
  };
  return (
    <div>
      {contextHolder}
      {!isShare ? (
        <div className=" flex h-screen w-screen flex-col items-center justify-between gap-8 overflow-y-scroll p-12">
          <p className=" text-3xl font-bold">取得你的發想成果之前，給Loudy一些回饋吧!</p>
          <Image width={384} src={imgUrl} alt="screenshot" />
          <div className=" flex h-fit w-2/3 flex-col gap-3">
            <div className="flex h-12 w-full items-center justify-between ">
              <p className=" font-bold">若想持續追蹤Loudy的新產品，請留下email</p>
              <input
                className="h-12 w-60  rounded-md border pl-2"
                type="email"
                onChange={(event) => {
                  setUserMail(event.target.value);
                }}
              />
            </div>
            <div className="flex h-12 w-full items-center justify-between ">
              <p>1. 就讀學校</p>
              <input
                className="h-12 w-60 rounded-md border pl-2"
                type="text"
                onChange={(event) => SetQ1(event.target.value)}
              />
            </div>
            <div className="flex h-12 w-full items-center justify-between ">
              <p>2. 年級</p>
              <select
                className="h-12 rounded-lg border pl-2"
                onChange={(event) => {
                  SetQ2(event.target.value);
                }}
              >
                <option value="">--請選擇--</option>
                <option value="一年級">一年級</option>
                <option value="二年級">二年級</option>
                <option value="三年級">三年級</option>
              </select>
            </div>
            <div className="flex h-12 w-full items-center justify-between ">
              <p>3. 性別</p>
              <select
                className="h-12 rounded-lg border pl-2"
                onChange={(event) => {
                  SetQ3(event.target.value);
                }}
              >
                <option value="">--請選擇--</option>
                <option value="男">男</option>
                <option value="女">女</option>
                <option value="非二元性別">非二元性別</option>
                <option value="不願意回答">不願意回答</option>
              </select>
            </div>
            <div className="flex h-12 w-full items-center justify-between ">
              <p>4. 1~10分， Loudy 幫助你發想自主學習主題的成效為何?（此為測試版，請先不評論視覺設計）</p>
              <select
                className="h-12 rounded-lg border pl-2"
                onChange={(event) => {
                  SetQ4(event.target.value);
                }}
              >
                <option value="">--請選擇--</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>
            <div className="flex h-12 w-full items-center justify-between ">
              <p>5. 發想成果中，有幾個主題是你之前沒想過的？</p>
              <select
                className="h-12 rounded-lg border pl-2"
                onChange={(event) => {
                  SetQ5(event.target.value);
                }}
              >
                <option value="">--請選擇--</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>
            <div className="flex h-12 w-full items-center justify-between ">
              <p>6. 發想成果中，有幾個主題是你真的可能會執行的？</p>
              <select
                className="h-12 rounded-lg border pl-2"
                onChange={(event) => {
                  SetQ6(event.target.value);
                }}
              >
                <option value="">--請選擇--</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>
            <div className="flex h-12 w-full items-center justify-between ">
              <p> 7. 你會向朋友推薦 Loudy 的可能性有多大？</p>
              <select
                className="h-12 rounded-lg border pl-2"
                onChange={(event) => {
                  SetQ7(event.target.value);
                }}
              >
                <option value="">--請選擇--</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>
            <div className="flex h-12 w-full items-center justify-between ">
              <p> 8. 你下學期再回來使用 Loudy 的可能性有多大？</p>
              <select
                className="h-12 rounded-lg border pl-2"
                onChange={(event) => {
                  SetQ8(event.target.value);
                }}
              >
                <option value="">--請選擇--</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>
            <div className="flex w-full flex-col justify-between gap-2">
              <p>9. 你喜歡 Loudy 的什麼？不喜歡什麼？留下你的任何建議！</p>
              <textarea
                className=" w-full border p-2"
                cols={3}
                rows={3}
                onChange={(event) => {
                  SetQ9(event.target.value);
                }}
              />
            </div>
          </div>
          <div className="flex w-full justify-end p-4">
            <button
              onClick={handleSubmit}
              className="rounded-xl border border-green-400 bg-green-200 p-4 text-2xl hover:border-2"
            >
              提交
            </button>
          </div>
        </div>
      ) : (
        <Share />
      )}
    </div>
  );
};

export default Result;
