"use client";
import React, { useEffect, useState } from "react";
import EvaluationCard from "./EvaluationCard";

type StepType = "step1" | "step2" | "step3" | "select" | "done";

const EvaluationPage = () => {
  const [step, setStep] = useState<StepType>("step1");

  const handleStep = (step: StepType) => {
    setStep(step);
  };

  useEffect(() => {
    console.log(step);
  }, [step]);

  const evaluationList = [
    {
      key: "question1",
      question: "我想知道這年紀都有容貌焦慮嗎？",
      callback: () => {
        handleStep("step2");
      }
    },
    {
      key: "question2",
      question: "Lisa單飛之後，Blackpink會怎樣？",
      callback: () => {
        handleStep("step3");
      }
    },
    {
      key: "question3",
      question: "統計學",
      callback: () => {
        handleStep("select");
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
