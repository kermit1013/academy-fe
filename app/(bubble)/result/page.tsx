"use client";
import React, { useState } from "react";
import { message } from "antd";
import axios from "axios";

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
  const [userMail, setUserMail] = useState("");
  const handleShare = async () => {
    messageApi.open({
      type: "success",
      content: "已送出!"
    });

    const res = await axios.post("http://139.162.82.246:8080/result", {
      room: "65f47961-a680-45ab-85ee-d7fa82ebf027",
      username: "小白",
      screenShot: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA",
      email: userMail,
      feedback: "{}"
    });
    console.log(prop, res);
  };
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-black/50">
      {contextHolder}
      <div className="flex h-fit w-4/5 flex-col gap-10 rounded-lg bg-white p-14">
        <p className="text-center text-3xl font-bold">祝你自主學習順利喔！</p>
        <div className="flex  items-center justify-center gap-10">
          <img
            className=" h-60 w-60"
            src={"https://img.freepik.com/free-vector/bokeh-defocused-background_23-2148497833.jpg"}
            alt="screenshot"
          />
          <div className="flex flex-col">
            <button>下載你的發想成果</button>
            <button>分享此網站給朋友</button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <img
              className=" h-20 w-20"
              src={"https://img.freepik.com/free-vector/bokeh-defocused-background_23-2148497833.jpg"}
              alt="QRCode"
            />
            <p>追蹤轉屋IG</p>
          </div>
          <div className="flex flex-col gap-2">
            <p>若想持續追蹤Loudy的新產品，請留下email</p>
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
  const handleSubmit = () => {
    setIsShare(true);
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
    SetToShare({
      QList: list
    });
  };
  return (
    <div>
      {!isShare ? (
        <div className=" flex h-screen w-screen flex-col items-center justify-between gap-8 overflow-y-scroll p-12">
          <p className=" text-3xl font-bold">取得你的發想成果之前，給Loudy一些回饋吧!</p>
          <img
            className=" h-60 w-60"
            src={"https://img.freepik.com/free-vector/bokeh-defocused-background_23-2148497833.jpg"}
            alt="screenshot"
          />
          <div className=" flex h-fit w-2/3 flex-col gap-2">
            <div className="flex w-full justify-between">
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
                <option value="">--Please choose--</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <div className="w-full">
              <p>2. 發想成果中，有幾個主題是你之前沒想過的？</p>
              <textarea
                className=" w-full border p-2"
                cols={3}
                rows={3}
                onChange={(event) => {
                  SetQ2(event.target.value);
                }}
              />
            </div>
            <div className="w-full">
              <p>3. 發想成果中，有幾個主題是你真的可能會執行的？</p>
              <textarea
                className=" w-full border p-2"
                cols={3}
                rows={3}
                onChange={(event) => {
                  SetQ3(event.target.value);
                }}
              />
            </div>
            <div className="flex w-full justify-between">
              <p>4. 你會推薦其他人使用此網站嗎？</p>
              <select
                className=" rounded-lg border pl-2"
                onChange={(event) => {
                  SetQ4(event.target.value);
                }}
              >
                <option value="">--Please choose--</option>
                <option value="yes">當然</option>
                <option value="think">考慮一下</option>
                <option value="maybe_no">應該不會</option>
                <option value="no">絕對不會</option>
              </select>
            </div>
            <div className="flex w-full justify-between">
              <p>5. 你下學期會再回來使用此網站協助發想嗎？</p>
              <select
                className=" rounded-lg border pl-2"
                onChange={(event) => {
                  SetQ5(event.target.value);
                }}
              >
                <option value="">--Please choose--</option>
                <option value="yes">當然</option>
                <option value="think">考慮一下</option>
                <option value="maybe_no">應該不會</option>
                <option value="no">絕對不會</option>
              </select>
            </div>
            <div className="w-full">
              <p>6. 若你已經選擇好主題，下列哪個是你最可能遇到困難的步驟？</p>
              <textarea
                className=" w-full border p-2"
                cols={3}
                rows={3}
                onChange={(event) => {
                  SetQ6(event.target.value);
                }}
              />
            </div>
            <div className="w-full">
              <p> 7. 你最喜歡此網站的哪個橋段？</p>
              <textarea
                className=" w-full border p-2"
                cols={3}
                rows={3}
                onChange={(event) => {
                  SetQ7(event.target.value);
                }}
              />
            </div>
            <div className="w-full">
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
