// TODO: 用於 Auth 相關資訊 (會員 Token, 會員資訊等)
import { StateCreator } from "zustand";
import { immer } from "zustand/middleware/immer";

export type AuthState = {
  accessToken: string;
  setAccessToken: (token: string) => void;
};

export const createAuthSlice: StateCreator<AuthState, [["zustand/immer", never]], [["zustand/immer", never]]> = immer(
  (set) => ({
    accessToken: "",
    setAccessToken: (token: string) =>
      set((state) => {
        state.accessToken = token;
      })
  })
);
