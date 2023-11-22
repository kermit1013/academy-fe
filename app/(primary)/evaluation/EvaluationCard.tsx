"use client";

import { Rate } from "antd";
import React, { useEffect, useState } from "react";

import MonsterCircleIcon from "@/app/(primary)/evaluation/icon/MonsterCircleIcon";
import MonsterDefault from "@/app/(primary)/evaluation/icon/MonsterDefaultIcon";
import MonsterExclamationIcon from "@/app/(primary)/evaluation/icon/MonsterExclamationIcon";
import MonsterTriangleIcon from "@/app/(primary)/evaluation/icon/MonsterTriangleIcon";

type TStatusList = {
  [key in string]: {
    tip: string;
    icon?: React.ReactNode;
  };
};

const statusList: TStatusList = {
  default: {
    tip: "嘗試回答關於下方評估主題的三個小問題吧！",
    icon: <MonsterDefault />
  },
  bad: {
    tip: "這個主題可能在執行上會耗費你很大的心力，可以嘗試更改題目，來重新評估喔！",
    icon: <MonsterTriangleIcon />
  },
  good: {
    tip: "太可惜了！看來這個主題欠缺臨門一腳！可以稍微調整題目，來重新評估喔！",
    icon: <MonsterExclamationIcon />
  },
  excellent: {
    tip: "哇嗚！整體來說，這個主題看來這是一個相對可行的主題方向呢！！",
    icon: <MonsterCircleIcon />
  }
};

type EvaluationCardProps = {
  question: string;
  handleStep: () => void;
};

const EvaluationCard = ({ question, handleStep }: EvaluationCardProps) => {
  const [currentStatus, setCurrentStatus] = useState("default");
  const [isAllChecked, setIsAllChecked] = useState(false);

  const [ratingList, setRatingList] = useState([
    {
      key: "motivation",
      label: "動機程度",
      point: 0
    },
    {
      key: "focus",
      label: "聚焦程度",
      point: 0
    },
    {
      key: "difficulty",
      label: "難易程度",
      point: 0
    }
  ]);

  useEffect(() => {
    const totalPoint = ratingList.reduce((prev, cur) => {
      return prev + cur.point;
    }, 0);

    if (totalPoint > 0 && totalPoint <= 5) {
      setCurrentStatus("bad");
    } else if (totalPoint > 5 && totalPoint <= 10) {
      setCurrentStatus("good");
    } else if (totalPoint > 10) {
      setCurrentStatus("excellent");
    }

    // isAllChecked 需各個 point 皆大於 0，才會改變為 true
    const isAllChecked = ratingList.every((item) => item.point > 0);
    setIsAllChecked(isAllChecked);
  }, [ratingList]);

  useEffect(() => {
    if (isAllChecked) {
      // TODO: 下一階段 或 進入下一個主流程
      handleStep();
    }
  }, [isAllChecked]);

  const handleRatingChange = (value: number, key: string) => {
    // 第一次點擊評分後，則永遠不為 0
    if (value === 0) return;

    // 設定評分
    setRatingList((prevRatingList) =>
      prevRatingList.map((item) => {
        if (item.key === key) {
          return { ...item, point: value };
        }
        return item;
      })
    );
  };

  // [minmax(80px, 15%), 30%, 1fr]
  return (
    // TODO: 最外層的 grid_rows 需再調整
    <div className="relative grid min-h-[680px] w-[266px] cursor-pointer grid-rows-[80px_30%_1fr] gap-y-4 rounded-xl border-[4px] border-[#30A549] bg-[#d9d9d9]/40 px-4 py-12 text-lg">
      <div className="absolute -top-[115px] left-3 h-[7.5rem] w-[7.5rem]">{statusList[currentStatus].icon}</div>

      <p>{statusList[currentStatus].tip}</p>

      <h2 className="h-fit max-w-max self-center justify-self-center rounded-lg border-[4px] border-[#30A549] p-2 text-center text-2xl font-bold">
        <span>{question}</span>
      </h2>

      <div className="flex flex-col gap-y-4">
        {ratingList.map((item) => (
          <div key={item.key} className="rounded-lg border border-[#30A549] px-2.5 py-2">
            <h3 className="w-fit rounded-l-lg rounded-br-lg bg-[#30A549] px-1">{item.label}</h3>
            <div className="w-full text-center">
              <Rate
                // character={<BorderOutlined className="" />}
                value={item.point}
                onChange={(value) => handleRatingChange(value, item.key)}
                style={{ color: "#30A549", marginTop: "20px", marginLeft: "1rem", borderColor: "black" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvaluationCard;
