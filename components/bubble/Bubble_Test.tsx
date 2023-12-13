import React, { memo, useEffect, useState } from "react";
import { Handle, Position, NodeResizer, NodeToolbar, useViewport, useOnViewportChange, useReactFlow } from "reactflow";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import useClusterPosition from "@/hooks/useClusterPosition";
import type { Edge, Node } from "reactflow";
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

const Bubble_Test = ({ data }: props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isTextEdit, setIsTextEdit] = useState(false);
  const { screenToFlowPosition } = useReactFlow();
  const [bubbleText, setBubbleText] = useState(data.label);
  const { updateNode, setIsEdit } = useClusterPosition();
  const center_id = localStorage.getItem("center");
  const isSelf = data.id === center_id || data.parentNode === center_id;
  const selfClass = isSelf ? "border-green-500" : "border-orange-500";
  const bubbleClass = data.parentNode === "" ? "h-40 w-40 text-md" : "h-fit w-64 text-gray-400 text-2xl";
  const handlerEdited = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    setIsTextEdit(!isTextEdit);
  };

  useEffect(() => {
    setBubbleText(data.label);
  }, [data.label]);

  useEffect(() => {
    if (isTextEdit || bubbleText === "") return;
    console.log("update data");
    const editNode: Node = {
      id: data.id,
      type: "bubble",
      data: {
        id: data.id,
        label: bubbleText,
        position: screenToFlowPosition(data.position),
        parentNode: data.parentNode,
        level: data.level
      },
      position: screenToFlowPosition(data.position),
      parentNode: data.parentNode
    };
    updateNode(editNode);
    setIsEdit(true);
  }, [isTextEdit, bubbleText]);

  useEffect(() => {
    console.log("bubble Text Update", bubbleText);
  }, [bubbleText]);

  const onchange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    let message = "";
    if (event.target.value.length >= 20) {
      messageApi.open({
        type: "warning",
        content: "超過字數"
      });
      message = event.target.value.substring(0, 20);
    } else {
      message = event.target.value;
    }
    setBubbleText(message);
  };
  const onclick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
  };
  const onblur = () => {
    if (bubbleText === "") {
      setBubbleText(data.label);
    }
    setIsTextEdit(false);
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

      {data.level === 1 ? (
        <></>
      ) : (
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: isSelf ? "#22c55e" : "#F97316", height: 10, width: 10, borderRadius: 5 }}
          onConnect={(params) => console.log("handle onConnect", params)}
          isConnectable={true}
          isConnectableStart={false}
        />
      )}
      {data.level === 3 ? (
        <></>
      ) : (
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: isSelf ? "#22c55e" : "#F97316", height: 10, width: 10, borderRadius: 5 }}
          onConnect={(params) => console.log("handle onConnect", params)}
          isConnectable={true}
        />
      )}

      <div
        className={`${bubbleClass} ${selfClass} flex items-center justify-center overflow-hidden rounded-full border-4  text-center`}
      >
        {isTextEdit && data.level !== 1 ? (
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
    </div>
  );
};

export default Bubble_Test;
