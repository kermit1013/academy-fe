import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import type { Node } from "reactflow";
const Bubble_V2 = (data) => {
  const [isEdit, setIsEdit] = useState(false);
  const [bubbleText, setBubbleText] = useState("");
  const handleEdit = () => {
    setIsEdit(true);
  };
  const onBlur = () => {
    setIsEdit(false);
  };
  return (
    <div onDoubleClick={handleEdit} onBlur={() => onBlur()}>
      <Handle type="target" position={Position.Left} isConnectable={true} isConnectableStart={false} />
      <Handle type="source" position={Position.Right} isConnectable={true} />
      {isEdit ? (
        <textarea
          autoFocus
          value={bubbleText}
          placeholder={data.label}
          onChange={(event) => {
            setBubbleText(event.target.value);
          }}
        />
      ) : (
        <p>{bubbleText}</p>
      )}
    </div>
  );
};

export default Bubble_V2;
