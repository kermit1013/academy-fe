import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Node, Edge } from "reactflow";

type State = {
  nodeList: Node<any, string | undefined>[];
  edgeList: Edge<any>[];
  levelOneHintListType1: string[];
  levelTwoHintListType1: string[];
  levelOneHintListType2: string[];
  levelTwoHintListType2: string[];
};

type Actions = {
  removeNode: (id: string) => void;
  addNode: (node: Node) => void;
  updateNode: (node: Node) => void;
  removeEdge: (id: string) => void;
  addEdge: (edge: Edge) => void;
  updateNodePosition: (id: string, x: number, y: number) => void;
};

const useClusterPosition = create<State & Actions>()(
  immer((set) => ({
    nodeList: [],
    edgeList: [],
    levelOneHintListType1: [
      "寫一項你喜歡的人事物",
      "寫一項令你困擾的人事物",
      "寫一項你擅長的事物",
      "寫一項你不擅長的事物",
      "過去一週發生的趣事"
    ],
    levelTwoHintListType1: ["針對這些關鍵字，你想了解什麼？", "針對這些關鍵字，你想解決什麼？"],
    levelOneHintListType2: [
      "如果你能擁有一個技能或專長，那會是什麼？",
      "如果你可以改變你的社區或學校的一個方面，那會是什麼？",
      "如果你有一個月的自由時間，你會怎麼安排？",
      "描述你理想中十年後的生活。",
      "如果你有機會召開一個國際性的會議，那會是什麼樣的會議？"
    ],
    levelTwoHintListType2: ["你可以如何實現上述回覆？", "你需要先了解什麼？"],
    removeNode: (id: string) =>
      set((state) => ({
        nodeList: state.nodeList.filter((node: Node) => node.id !== id)
      })),
    addNode: (node: Node) =>
      set((state) => {
        const newList = [...state.nodeList, node];
        return { ...state, nodeList: newList };
      }),
    updateNode: (node: Node) =>
      set((state) => {
        const newList = state.nodeList.map((n: Node) => {
          if (n.id === node.id) {
            return {
              node
            };
          }
          return n;
        });

        return { ...state, nodeList: newList };
      }),
    removeEdge: (id: string) =>
      set((state) => ({
        nodeList: state.edgeList.filter((edge: Edge) => edge.id !== id)
      })),
    addEdge: (edge: Edge) =>
      set((state) => {
        const newList = [...state.edgeList, edge];
        return { ...state, edgeList: newList };
      }),
    updateNodePosition: (id: string, x: number, y: number) =>
      set((state) => {
        const newList = state.nodeList.map((node: Node) => {
          if (node.id === id) {
            return {
              ...node,
              position: {
                x,
                y
              }
            };
          }
          return node;
        });

        return { ...state, nodeList: newList };
      })
  }))
);

export default useClusterPosition;
