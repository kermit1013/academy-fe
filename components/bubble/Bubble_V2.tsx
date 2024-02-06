import React, { useEffect, useState } from "react";
import { Handle, Position, NodeResizer, NodeToolbar, useViewport, useOnViewportChange, useReactFlow } from "reactflow";
import type { Node } from "reactflow";
import useBubble from "@/hooks/useBubble";
import { message } from "antd";

interface props {
  data: {
    id: string;
    label: string;
    position: {
      x: number;
      y: number;
    };
    center_id: string;
    parentNode: string;
    level: number;
  };
}

const Cluster = ({ data }: props) => {
  const [bubbleSize, setBubbleSize] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [modifyText, setModifyText] = useState("");
  const { nodes, edges, setEdge, setNode } = useBubble();

  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    const border_color = localStorage.getItem("center") === data.center_id ? "border-[#22C55E]" : "border-[#F97316]";
    data.level === 1 ? setBubbleSize(`h-40 w-40 ${border_color}`) : setBubbleSize(`h-20 w-[300px] ${border_color}`);
  }, []);

  useEffect(() => {
    if (modifyText.length > 20) {
      messageApi.open({
        type: "warning",
        content: "已達限制字數!"
      });
      setModifyText(modifyText.substring(0, 20));
    }
  }, [modifyText]);

  const onEdit = (status: boolean) => {
    if (!status) {
      const editNode: Node = {
        id: data.id,
        type: "bubble",
        data: {
          id: data.id,
          label: modifyText,
          position: data.position,
          center_id: data.center_id,
          level: data.level
        },
        position: data.position
      };
      const newNode = nodes.filter((node: Node) => {
        return node.id !== data.id;
      });
      setNode([...newNode, editNode]);
      setEdge(edges);
    }

    setIsEdit(status);
  };
  return (
    <div
      className={`${bubbleSize} z-10 flex items-center justify-center overflow-hidden rounded-[50px] border-2 text-center`}
      onDoubleClick={() => {
        if (data.level !== 1) {
          onEdit(true);
        }
      }}
      onBlur={() => {
        onEdit(false);
      }}
    >
      {contextHolder}
      {data.level === 1 ? (
        <></>
      ) : (
        <Handle
          type="target"
          position={Position.Left}
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
          onConnect={(params) => console.log("handle onConnect", params)}
          isConnectable={true}
        />
      )}
      {isEdit ? (
        <textarea
          autoFocus
          className="h-20 w-[300px] rounded-[50px] p-4 text-center"
          rows={3}
          value={modifyText}
          onChange={(e) => setModifyText(e.target.value)}
        />
      ) : (
        <div>
          <p>{data.label}</p>
        </div>
      )}
    </div>
  );
};

export default Cluster;
