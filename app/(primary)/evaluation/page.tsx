"use client";
import React from "react";
import EvaluationCard from "./EvaluationCard";
import { useStore } from "@/store/rootStore";

const EvaluationPage = () => {
  const updateCurrentStepStatus = useStore((state) => state.updateCurrentStepStatus);

  const evaluationList = [
    {
      key: "question1",
      question: "我想知道這年紀都有容貌焦慮嗎？",
      callback: () => {
        updateCurrentStepStatus(0);
      }
    },
    {
      key: "question2",
      question: "Lisa單飛之後，Blackpink會怎樣？",
      callback: () => {
        updateCurrentStepStatus(1);
      }
    },
    {
      key: "question3",
      question: "統計學",
      callback: () => {
        updateCurrentStepStatus(2);
      }
    }
  ];

  return (
    <div className="mt-20 flex min-h-full md:mt-0">
      <div className="flex w-full flex-col items-center justify-center gap-x-4 gap-y-32 md:flex-row">
        {evaluationList.map((item) => (
          <EvaluationCard key={item.key} question={item.question} handleStep={item.callback} />
        ))}
      </div>

      {/* TODO: 評分怪獸 */}
      <div className="items-center justify-center self-center">評分怪獸123123123</div>
    </div>
  );
};

export default EvaluationPage;
