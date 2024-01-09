import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Node, Edge } from "reactflow";

type State = {
  nodes: Node[];
  edges: Edge[];
  isEdit: boolean;
  isConnect: boolean;
  MyRoomId: string;
  imgUrl: string;
};

type Actions = {
  setNode: (list: Node[]) => void;
  setEdge: (list: Edge[]) => void;
  setImage: (url: string) => void;
  setMyRoomId: (RoomId: string) => void;
  setConnect: (status: boolean) => void;
  setIsEdit: (status: boolean) => void;
};

const useBubble = create<State & Actions>()(
  immer((set) => ({
    nodes: [],
    edges: [],
    isEdit: false,
    isConnect: false,
    MyRoomId: "",
    imgUrl: "",
    setNode: (list: Node[]) =>
      set((state) => {
        return { ...state, nodes: list };
      }),
    setEdge: (list: Edge[]) =>
      set((state) => {
        return { ...state, edges: list };
      }),
    setImage: (url: string) =>
      set((state) => {
        return { ...state, imgUrl: url };
      }),
    setMyRoomId: (MyRoomId: string) =>
      set((state) => {
        return { ...state, MyRoomId };
      }),
    setConnect: (status: boolean) =>
      set((state) => {
        return { ...state, isConnect: status };
      }),
    setIsEdit: (status: boolean) =>
      set((state) => {
        return { ...state, ised: status };
      })
  }))
);

export default useBubble;
