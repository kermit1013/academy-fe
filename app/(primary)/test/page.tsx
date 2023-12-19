"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  Controls,
  BackgroundVariant,
  useOnSelectionChange,
  Position,
  Background
} from "reactflow";
import { v4 as uuidv4 } from "uuid";
import "reactflow/dist/style.css";
import "../../../styles/globals.css";
import Bubble from "@/components/bubble/Bubble_V2";

const nodeTypes = {
  bubble: Bubble
};

const centerDefault = {
  sourcePosition: Position.Right,
  style: {
    borderRadius: "100%",
    borderWidth: "3px",
    borderColor: "#22c55e",
    backgroundColor: "#fff",
    width: 81,
    height: 81,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
};

const inputDefault = {
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  style: {
    borderColor: "#22c55e",
    backgroundColor: "#fff",
    width: 200,
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
};

const AddNodeOnEdgeDrop = () => {
  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);

  const [userName, setUserName] = useState("");
  useEffect(() => {
    setUserName(localStorage.getItem("user_name")!);
  }, []);
  const initialNodes = [
    {
      id: `level_1_${uuidv4()}`,
      data: { label: `十年後的${userName}` },
      position: { x: 0, y: 50 },
      ...centerDefault
    }
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const onConnect = useCallback((params) => {
    // reset the start node on connections
    connectingNodeId.current = null;
    setEdges((eds) => addEdge(params, eds));
  }, []);

  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd = useCallback(
    (event) => {
      if (!connectingNodeId.current) return;

      const targetIsPane = event.target.classList.contains("react-flow__pane");

      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        console.log(`${connectingNodeId.current}`.split("_"));
        const id = `${connectingNodeId.current}`.split("_")[1] === "1" ? `level_2_${uuidv4()}` : `level_3_${uuidv4()}`;
        const newNode = {
          id,
          position: screenToFlowPosition({
            x: event.clientX + 200,
            y: event.clientY - 60
          }),
          data: { label: "" },
          origin: [0.5, 0.0],
          ...inputDefault
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({
            id,
            source: connectingNodeId.current,
            target: id,
            style: { stroke: "#22c55e", strokeWidth: "3" }
          })
        );
      }
    },
    [screenToFlowPosition]
  );
  const [isSelect, setIsSelect] = useState(false);
  const [modifyValue, setModifyValue] = useState("");
  const onBlur = () => {
    setIsSelect(false);
  };
  const onSelect = () => {
    console.log("isselect");
    setIsSelect(true);
  };
  return (
    <div className="relative h-screen w-screen" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onBlur={onBlur}
        onNodeClick={onSelect}
        fitView
        fitViewOptions={{ padding: 2 }}
        nodeOrigin={[0.5, 0]}
        className="intersection-flow"
      >
        <Background color="#ACD2FF" variant={BackgroundVariant.Lines} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

const ReturnPage = () => (
  <ReactFlowProvider>
    <AddNodeOnEdgeDrop />
  </ReactFlowProvider>
);

export default ReturnPage;
