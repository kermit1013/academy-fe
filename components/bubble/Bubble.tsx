import React, { memo, useEffect, useState } from "react";
import { Handle, Position, NodeResizer, NodeToolbar, useViewport, useOnViewportChange } from "reactflow";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import useClusterPosition from "@/hooks/useClusterPosition";
import type { Edge, Node, Viewport } from "reactflow";
import { message } from "antd";

interface props {
  data: {
    id: string;
    label: string;
    position: {
      x: number;
      y: number;
    };
    parentNode: string;
    level: number;
  };
}

const Bubble = ({ data }: props) => {
  const [messageApi, contextHolder] = message.useMessage();

  const [isEdit, setIsEdit] = useState(false);
  const [bubbleText, setBubbleText] = useState(data.label);
  const [isSelected, setIsSelected] = useState(false);
  const { removeNode, addNode, removeEdge, addEdge, nodeList, levelTwoHintListType1, levelTwoHintListType2, edgeList } =
    useClusterPosition();
  const choice = localStorage.getItem("choice");
  const bubbleClass =
    data.parentNode === ""
      ? choice === "0"
        ? "h-40 w-40 text-2xl"
        : "h-40 w-40 text-md"
      : "h-fit w-64 text-gray-400 text-2xl";

  const handlerEdited = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    setBubbleText("");
    setIsEdit(!isEdit);
    setIsSelected(false);
  };
  const onchange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(event);
    if (event.target.value.length >= 20) {
      messageApi.open({
        type: "warning",
        content: "超過字數"
      });
      setBubbleText(event.target.value.substring(0, 20));
    } else {
      setBubbleText(event.target.value);
    }
  };
  const onclick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    setIsSelected(!isSelected);
  };
  const onblur = () => {
    if (bubbleText === "") {
      setBubbleText(data.label);
    }
    setIsEdit(false);
    setIsSelected(false);
  };
  const handlerRemoveNode = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    event.stopPropagation();
    console.log("minus");
    removeNode(data.id);
    const selectEdge: Edge = edgeList.filter((edge) => edge.targetNode?.id === data.id)[0];
    removeEdge(selectEdge.id);
  };
  const checkPermission = (): boolean => {
    if (data.level === 1) {
      const filterNode = nodeList.filter((node) => node.parentNode === data.id);
      console.log(filterNode);
      if (filterNode.length >= 3) {
        messageApi.open({
          type: "warning",
          content: "已達上限"
        });

        return false;
      }
    } else if (data.level === 2) {
      const filterNode = nodeList.filter((node) => node.parentNode === data.id);
      console.log(filterNode);
      if (filterNode.length >= 1) {
        messageApi.open({
          type: "warning",
          content: "已達上限"
        });
        return false;
      }
    }
    return true;
  };
  const handlerAddNode = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const levelTwo = localStorage.getItem("choice") === "0" ? levelTwoHintListType1 : levelTwoHintListType2;
    const result = checkPermission();
    if (!result) {
      return;
    }
    event.stopPropagation();
    console.log("plus");
    const randomIndex = Math.floor(Math.random() * levelTwo.length);
    const NodeId = data.level === 1 ? `level2_${+new Date()}` : `level3_${+new Date()}`;
    const { x, y } = data.position;
    let bubbleCount = localStorage.getItem("levelTwoBubble");
    if (bubbleCount) {
      localStorage.setItem("levelTwoBubble", "0");
      bubbleCount = "0";
    } else {
      localStorage.setItem("levelTwoBubble", ((parseInt(bubbleCount!) + 1) % levelTwo.length).toString());
    }
    const newNode: Node = {
      id: NodeId,
      type: "bubble",
      data: {
        id: NodeId,
        label: data.level === 1 ? levelTwo[randomIndex] : "這讓你想到什麼自主學習主題？",
        position: {
          x: x + 100,
          y: data.parentNode ? y - 100 : y
        },
        parentNode: data.id,
        level: data.level === 1 ? 2 : 3
      },
      position: {
        x: x + 100,
        y: y - 100
      },
      parentNode: data.id
    };
    addNode(newNode);
    const EdgeId = data.level === 1 ? `1to2_${+new Date()}` : `2to3_${+new Date()}`;
    const newEdge: Edge = {
      id: EdgeId,
      source: data.id,
      target: NodeId,
      style: { stroke: "#22C55E", strokeWidth: "3" }
    };
    addEdge(newEdge);
    setIsSelected(false);
  };

  interface OptionButtonProps {
    level: number;
  }
  const OptionButton = ({ level }: OptionButtonProps) => {
    return level < 3 ? (
      <div className="flex h-full w-40 items-center justify-between rounded-full border-2 border-green-500 px-3 ">
        <MinusOutlined
          onClick={(event) => handlerRemoveNode(event)}
          className="flex items-center font-sans text-3xl font-extrabold text-red-500 hover:cursor-pointer  "
        />
        <svg width="2" height="29" viewBox="0 0 2 29" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect opacity="0.2" width="2" height="29" rx="1" fill="#30A549" />
        </svg>

        <PlusOutlined
          onClick={(event) => handlerAddNode(event)}
          className="flex items-center font-sans text-3xl font-extrabold text-green-500 hover:cursor-pointer "
        />
      </div>
    ) : (
      <div className="flex h-full w-24 items-center justify-center rounded-full border-2 border-green-500 px-3 ">
        <MinusOutlined
          onClick={(event) => handlerRemoveNode(event)}
          className="flex items-center font-sans text-3xl font-extrabold text-red-500 hover:cursor-pointer"
        />
      </div>
    );
  };
  return (
    <div
      className="relative "
      onDoubleClick={(event) => {
        handlerEdited(event);
      }}
      onClick={(event) => onclick(event)}
      onBlur={() => onblur()}
      title={data.label}
    >
      {contextHolder}
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#555" }}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={{ background: "#555" }}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={true}
      />

      <div
        className={`${bubbleClass} flex items-center justify-center overflow-hidden rounded-full border-4 border-green-500 text-center`}
      >
        {isEdit ? (
          <textarea
            autoFocus
            value={bubbleText}
            placeholder={data.label}
            onChange={(event) => onchange(event)}
            className={`${bubbleClass} flex-wrap overflow-visible break-all rounded-full p-4 text-center align-middle focus:outline-0`}
          />
        ) : (
          <p className="break-all p-4 text-center">{bubbleText}</p>
        )}
      </div>
      {isSelected ? (
        <div className="absolute -bottom-14 flex  h-12 w-full justify-center">
          <OptionButton level={data.level} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Bubble;
