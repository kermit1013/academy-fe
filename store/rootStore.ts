import { create } from "zustand";
// import { persist } from "zustand/middleware";
import { StepState, createStepSlice } from "./stepStoreSlice";
import { AuthState, createAuthSlice } from "./authStoreSlice";
import { immer } from "zustand/middleware/immer";

const createRootSlice = create<AuthState & StepState>()(
  immer((...state) => ({
    ...createAuthSlice(...state),
    ...createStepSlice(...state)
  }))
);

export const useStore = createRootSlice;
