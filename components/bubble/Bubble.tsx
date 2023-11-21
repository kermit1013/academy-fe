import React, { memo, useState } from "react";
import { Handle, Position, NodeResizer } from "reactflow";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import useClusterPosition from "@/hooks/useClusterPosition";
import type { Edge, Node } from "reactflow";
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
  const [isEdit, setIsEdit] = useState(false);
  const [bubbleText, setBubbleText] = useState(data.label);
  const [isSelected, setIsSelected] = useState(false);
  const { removeNode, addNode, removeEdge, addEdge, levelOneHintList, edgeList } = useClusterPosition();
  const bubbleClass = data.parentNode === "" ? "h-40 w-40 " : "h-20 w-64 ";

  const handlerEdited = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    setBubbleText("");
    setIsEdit(!isEdit);
    setIsSelected(false);
  };
  const onchange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(event);
    if (event.target.value.length >= 20) {
      console.log("超過字數");
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
  const handlerAddNode = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    console.log(event);

    event.stopPropagation();
    console.log("plus");
    const randomIndex = Math.floor(Math.random() * levelOneHintList.length);
    const NodeId = `randomnode_${+new Date()}`;
    const { x, y } = data.position;
    const newNode: Node = {
      id: NodeId,
      type: "bubble",
      data: {
        id: NodeId,
        label: levelOneHintList[randomIndex],
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
    const EdgeId = `randomedge_${+new Date()}`;
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
          className="flex items-center font-sans text-3xl font-extrabold text-red-500 hover:cursor-pointer  hover:bg-red-300"
        />
        <svg width="2" height="29" viewBox="0 0 2 29" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect opacity="0.2" width="2" height="29" rx="1" fill="#30A549" />
        </svg>

        <PlusOutlined
          onClick={(event) => handlerAddNode(event)}
          className="flex items-center font-sans text-3xl font-extrabold text-green-500 hover:cursor-pointer hover:bg-red-300"
        />
      </div>
    ) : (
      <div className="flex h-full w-40 items-center justify-between rounded-full border-2 border-green-500 px-3 ">
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
    >
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
      <div>
        {isEdit ? (
          <textarea
            autoFocus
            rows={5}
            cols={15}
            value={bubbleText}
            placeholder={data.label}
            onChange={(event) => onchange(event)}
            className={`${bubbleClass} flex items-center justify-center overflow-hidden rounded-full border-4 border-green-500 p-4 text-center text-2xl focus:outline-0`}
          />
        ) : (
          <div>
            <p
              className={`${bubbleClass} flex items-center justify-center overflow-hidden rounded-full border-4 border-green-500 p-4 text-center text-2xl`}
            >
              {bubbleText}
            </p>
          </div>
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
