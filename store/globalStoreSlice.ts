// TODO: 用於 Auth 相關資訊 (會員 Token, 會員資訊等)
import { StateCreator } from "zustand";
import { immer } from "zustand/middleware/immer";

type TStepType = "Exploration" | "Evaluation" | "Goal" | "Planning";

export type GlobalState = {
  /**
   * 目前階段的位置
   */
  currentStep: TStepType;
  /**
   * 所有階段裡面的狀態
   */
  allStepStatus: {
    [key in TStepType]: boolean[];
  };
  /**
   * 設定目前的階段
   * @param newStep 下一個階段
   * @returns 設定當前的階段
   */
  setCurrentStep: (newStep: TStepType) => void;
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
  resetAllSetpStatus: () => void;
};

export const createGlobalSlice: StateCreator<GlobalState, [["zustand/immer", never]], [["zustand/immer", never]]> =
  immer((set) => ({
    currentStep: "Exploration",
    allStepStatus: {
      Exploration: [false, false, false],
      Evaluation: [false, false, false],
      Goal: [false, false, false],
      Planning: [false, false, false]
    },
    setCurrentStep: (newStep: TStepType) =>
      set((state) => {
        state.currentStep = newStep;
      }),
    updateCurrentStepStatus: (index: number) =>
      set((state) => {
        state.allStepStatus[state.currentStep][index] = true;
      }),
    resetAllSetpStatus: () =>
      set((state) => {
        state.allStepStatus = {
          Exploration: [false, false, false],
          Evaluation: [false, false, false],
          Goal: [false, false, false],
          Planning: [false, false, false]
        };
      })
  }));
