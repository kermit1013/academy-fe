import { create } from "zustand";
// import { persist } from "zustand/middleware";
import { GlobalState, createGlobalSlice } from "./globalStoreSlice";
import { AuthState, createAuthSlice } from "./authStoreSlice";
import { immer } from "zustand/middleware/immer";

const createRootSlice = create<GlobalState & AuthState>()(
  immer((...state) => ({
    ...createGlobalSlice(...state),
    ...createAuthSlice(...state)
  }))
);

export const useStore = createRootSlice;
