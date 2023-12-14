"use client";
import React, { useState } from "react";
import { message } from "antd";
import axios from "axios";
import useClusterPosition from "@/hooks/useClusterPosition";
import { QRCode } from "antd";
interface Props {
  QList: QList;
}

interface QList {
  Q1: string;
  Q2: string;
  Q3: string;
  Q4: string;
  Q5: string;
  Q6: string;
  Q7: string;
  Q8: string;
}

const Share = (prop: Props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { imgUrl, MyRoomId } = useClusterPosition();
  const [userMail, setUserMail] = useState("");
  const handleDownload = () => {
    const a = document.createElement("a");

    a.setAttribute("download", "reactflow.png");
    a.setAttribute("href", imgUrl);
    a.click();
  };
  const handleShare = async () => {
    messageApi.open({
      type: "success",
      content: "已送出!"
    });

    const res = await axios.post(
      "http://139.162.82.246:8080/result",
      {
        room: MyRoomId,
        username: localStorage.getItem("user_name"),
        screenShot: imgUrl,
        email: userMail,
        feedback: JSON.stringify(prop)
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    console.log(prop, res);
  };
  return (
    <div className="flex  h-screen w-screen flex-col items-center justify-center bg-black/50">
      {contextHolder}
      <div className="flex h-fit w-3/5 flex-col gap-10 rounded-lg bg-white bg-gradient-to-r from-sky-500/30 to-indigo-500/30 p-14">
        <p className="text-center text-4xl font-bold">祝你自主學習順利喔！</p>
        <div className="flex  items-center justify-center gap-10">
          <img className=" h-80 w-96 rounded-lg border-2 bg-white" src={imgUrl} alt="screenshot" />
          <div className="flex flex-col gap-2">
            <button
              className=" rounded-md border-2 bg-blue-100 p-2 text-xl font-bold  hover:bg-blue-200"
              onClick={handleDownload}
            >
              下載你的發想成果
            </button>
            <button className=" rounded-md border-2 bg-blue-100 p-2 text-xl font-bold hover:bg-blue-200">
              分享此網站給朋友
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <QRCode type="canvas" value="https://www.instagram.com/return_inn/" />
            <p className=" text-xl font-bold">追蹤轉屋IG</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className=" text-xl font-bold">若想持續追蹤Loudy的新產品，請留下email</p>
            <div className="flex gap-2">
              <input
                className="w-full rounded-md border pl-2"
                type="text"
                onChange={(event) => {
                  setUserMail(event.target.value);
                }}
              />
              <button
                onClick={handleShare}
                className="shrink-0 rounded-xl border border-green-400 bg-green-200 p-2 hover:border-2"
              >
                Enter
              </button>
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
  const [isShare, setIsShare] = useState(false);
  const [Q1, SetQ1] = useState("");
  const [Q2, SetQ2] = useState("");
  const [Q3, SetQ3] = useState("");
  const [Q4, SetQ4] = useState("");
  const [Q5, SetQ5] = useState("");
  const [Q6, SetQ6] = useState("");
  const [Q7, SetQ7] = useState("");
  const [Q8, SetQ8] = useState("");
  const [toShare, SetToShare] = useState<Props>();
  const handleSubmit = async () => {
    const list: QList = {
      Q1,
      Q2,
      Q3,
      Q4,
      Q5,
      Q6,
      Q7,
      Q8
    };
    const data = {
      room: MyRoomId,
      username: localStorage.getItem("user_name"),
      screenShot: imgUrl,
      email: "",
      feedback: JSON.stringify(list)
    };
    console.log(data);
    const res = await axios.post("http://139.162.82.246:8080/result", data, {
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
    SetToShare({
      QList: list
    });
    setIsShare(true);
  };
  return (
    <div>
      {contextHolder}
      {!isShare ? (
        <div className=" flex h-screen w-screen flex-col items-center justify-between gap-8 overflow-y-scroll p-12">
          <p className=" text-3xl font-bold">取得你的發想成果之前，給Loudy一些回饋吧!</p>
          <img className=" h-96 w-96 rounded-md border-2" src={imgUrl} alt="screenshot" />
          <div className=" flex h-fit w-2/3 flex-col gap-3">
            <div className="flex h-12 w-full justify-between">
              <p>
                1. 1~5分，此網路幫助你發想自主學習主題的成效為何?
                <br />
                (此版本為測試雛形，請先忽略視覺設計的評分)
              </p>
              <select
                className="h-12 rounded-lg border pl-2"
                onChange={(event) => {
                  SetQ1(event.target.value);
                }}
              >
                <option value="">--請選擇--</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <div className="flex h-12 w-full justify-between">
              <p>2. 發想成果中，有幾個主題是你之前沒想過的？</p>
              <select
                className="h-12 rounded-lg border pl-2"
                onChange={(event) => {
                  SetQ2(event.target.value);
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
            <div className="flex h-12 w-full justify-between">
              <p>3. 發想成果中，有幾個主題是你真的可能會執行的？</p>
              <select
                className="h-12 rounded-lg border pl-2"
                onChange={(event) => {
                  SetQ3(event.target.value);
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
            <div className="flex h-12 w-full justify-between">
              <p>4. 你會推薦其他人使用此網站嗎？</p>
              <select
                className=" rounded-lg border pl-2"
                onChange={(event) => {
                  SetQ4(event.target.value);
                }}
              >
                <option value="">--請選擇--</option>
                <option value="yes">當然</option>
                <option value="think">考慮一下</option>
                <option value="maybe_no">應該不會</option>
                <option value="no">絕對不會</option>
              </select>
            </div>
            <div className="flex h-12 w-full justify-between">
              <p>5. 你下學期會再回來使用此網站協助發想嗎？</p>
              <select
                className=" rounded-lg border pl-2"
                onChange={(event) => {
                  SetQ5(event.target.value);
                }}
              >
                <option value="">--請選擇--</option>
                <option value="yes">當然</option>
                <option value="think">考慮一下</option>
                <option value="maybe_no">應該不會</option>
                <option value="no">絕對不會</option>
              </select>
            </div>
            <div className="flex h-12 w-full justify-between">
              <p>6. 若你已經選擇好主題，下列哪個是你最可能遇到困難的步驟？</p>
              <select
                className=" rounded-lg border pl-2"
                onChange={(event) => {
                  SetQ6(event.target.value);
                }}
              >
                <option value="">--請選擇--</option>
                <option value="擬定計畫">擬定計畫</option>
                <option value="執行與紀錄">執行與紀錄</option>
                <option value="學習歷程製作">學習歷程製作</option>
                <option value="反思">反思</option>
              </select>
            </div>
            <div className="flex h-12 w-full justify-between">
              <p> 7. 你最喜歡此網站的哪個橋段？</p>
              <select
                className=" rounded-lg border pl-2"
                onChange={(event) => {
                  SetQ7(event.target.value);
                }}
              >
                <option value="">--請選擇--</option>
                <option value="發想理想中的自已">發想理想中的自已</option>
                <option value="跟陌生人發想自主學習主題">跟陌生人發想自主學習主題</option>
              </select>
            </div>
            <div className="flex w-full flex-col justify-between gap-2">
              <p>8. 為什麼喜歡以上橋段？也可留下任何回饋...</p>
              <textarea
                className=" w-full border p-2"
                cols={3}
                rows={3}
                onChange={(event) => {
                  SetQ8(event.target.value);
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
        <Share QList={toShare!.QList} />
      )}
    </div>
  );
};

export default Result;
