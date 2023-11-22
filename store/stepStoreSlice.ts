import { StateCreator } from "zustand";
import { immer } from "zustand/middleware/immer";

type TStepInfo = {
  type: "Exploration" | "Evaluation" | "Goal" | "Planning";
  name: "探索" | "評估" | "目標" | "計劃";
  nextName: TStepInfo["name"];
};

export type StepState = {
  /**
   * 目前階段的資訊(位置與標籤)
   */
  currentStepInfo: TStepInfo;
  /**
   * 所有階段裡面的狀態
   */
  allStepStatus: {
    [key in TStepInfo["type"]]: boolean[];
  };
  /**
   * 設定目前的階段
   * @param newStep 下一個階段的資訊
   * @returns 設定當前的階段
   */
  setCurrentStep: (newStep: TStepInfo) => void;
  /**
   * 改變當前階段的狀態
   * @param index 需要被更新的位置
   * @returns 階段的特定位置被更新為 true
   */
  updateCurrentStepStatus: (index: number) => void;
  /**
   * 當所有流程跑完時，需要重置狀態
   * @returns 每個階段更新為 false
   */
  resetAllStepStatus: () => void;
};

export const createStepSlice: StateCreator<StepState, [["zustand/immer", never]], [["zustand/immer", never]]> = immer(
  (set) => ({
    currentStepInfo: {
      type: "Exploration",
      name: "探索",
      nextName: "目標"
    },
    allStepStatus: {
      Exploration: [false, false, false],
      Evaluation: [false, false, false],
      Goal: [false, false, false],
      Planning: [false, false, false]
    },
    setCurrentStep: (newStep: TStepInfo) =>
      set((state) => {
        state.currentStepInfo = newStep;
      }),
    updateCurrentStepStatus: (index: number) =>
      set((state) => {
        state.allStepStatus[state.currentStepInfo.type][index] = true;
      }),
    resetAllStepStatus: () =>
      set((state) => {
        state.allStepStatus = {
          Exploration: [false, false, false],
          Evaluation: [false, false, false],
          Goal: [false, false, false],
          Planning: [false, false, false]
        };
      })
  })
);
