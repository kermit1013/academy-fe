"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
// import Consultation from "@/components/consultation/Consultation";
import ReactFlow, {
  MiniMap,
  Controls,
  ControlButton,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  useViewport,
  useReactFlow,
  ReactFlowProvider
} from "reactflow";
import type { Connection, NodeChange, Node, Edge, NodePositionChange, NodeDragHandler } from "reactflow";
import "reactflow/dist/style.css";
import Bubble from "@/components/bubble/Bubble";
import useClusterPosition from "@/hooks/useClusterPosition";
import Cluster from "@/components/bubble/Cluster";
import { Switch } from "antd";
const nodeTypes = {
  bubble: Bubble,
  cluster: Cluster
};
const FirstVisit = () => {
  return (
    <div className="flex h-full w-full items-center justify-center gap-10">
      <div className="relative h-40 w-40 overflow-hidden rounded-full">
        <svg
          className="absolute bottom-0"
          width="162"
          height="162"
          viewBox="0 0 162 162"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="81" cy="81" r="76" stroke="#30A549" strokeWidth="10" />
        </svg>
        <svg
          className="absolute bottom-0 left-6"
          width="117"
          height="126"
          viewBox="0 0 117 126"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M96.1641 0H55.7329C24.9554 0 0 23.8401 0 53.2597V113.748C0 120.254 5.52352 125.533 12.3326 125.533H13.0126C16.6452 125.533 19.5894 122.711 19.5894 119.24V117.631C19.5894 115.008 20.7008 112.638 22.5005 110.918C24.3002 109.198 26.7883 108.136 29.5334 108.136C31.0843 108.136 32.3367 109.333 32.3367 110.815V118.891C32.3367 120.722 33.1163 122.386 34.3769 123.583C35.6375 124.788 37.3709 125.533 39.2867 125.533C43.0022 125.533 46.0128 122.648 46.0128 119.097V106.837C46.0128 105.426 46.6182 104.15 47.5803 103.222C48.5589 102.295 49.8942 101.725 51.3705 101.725C55.086 101.725 58.0883 104.594 58.0883 108.144V116.117C58.0883 118.717 59.1913 121.071 60.9744 122.775C62.7575 124.479 65.2207 125.533 67.941 125.533C70.4208 125.533 72.4279 123.607 72.4279 121.237V117.346C72.4279 114.928 74.4847 112.971 77.0059 112.971H78.5651C80.2404 112.971 81.6006 114.263 81.6006 115.872V121.855C81.6006 122.87 82.0319 123.789 82.7285 124.455C83.4252 125.121 84.3872 125.533 85.4488 125.533C102.426 125.533 116.177 112.384 116.177 96.1687V19.1244C116.177 8.5596 107.211 0 96.1641 0ZM32.345 65.9485C31.4078 65.9485 30.6531 64.5061 30.6531 62.7308C30.6531 60.9554 31.4078 59.513 32.345 59.513C33.2739 59.513 34.0286 60.9554 34.0286 62.7308C34.0286 64.5061 33.2739 65.9485 32.345 65.9485ZM39.0711 73.6363C37.4538 73.6363 36.1434 68.7701 36.1434 62.7625C36.1434 56.7549 37.4538 51.8807 39.0711 51.8807C40.6966 51.8807 42.007 56.7549 42.007 62.7625C42.007 68.7701 40.6966 73.6363 39.0711 73.6363ZM47.8623 70.482C46.245 70.482 44.9346 66.7728 44.9346 62.1998C44.9346 57.6267 46.245 53.9176 47.8623 53.9176C49.4795 53.9176 50.7899 57.6267 50.7899 62.1998C50.7899 66.7728 49.4795 70.482 47.8623 70.482ZM55.1855 70.3076C54.381 70.3076 53.7258 66.9313 53.7258 62.7625C53.7258 58.5936 54.381 55.2094 55.1855 55.2094C55.9983 55.2094 56.6535 58.5936 56.6535 62.7625C56.6535 66.9313 55.9983 70.3076 55.1855 70.3076ZM61.7043 65.6395C60.2031 65.6395 58.9923 64.0464 58.9923 62.0809C58.9923 60.1074 60.2031 58.5144 61.7043 58.5144C63.1971 58.5144 64.408 60.1074 64.408 62.0809C64.408 64.0464 63.1971 65.6395 61.7043 65.6395ZM68.5382 70.3076C67.6093 70.3076 66.8546 66.9313 66.8546 62.7625C66.8546 58.5936 67.6093 55.2094 68.5382 55.2094C69.4671 55.2094 70.2218 58.5936 70.2218 62.7625C70.2218 66.9313 69.4671 70.3076 68.5382 70.3076ZM76.8566 73.6363C74.9906 73.6363 73.4894 68.7701 73.4894 62.7625C73.4894 56.7549 74.9906 51.8807 76.8566 51.8807C78.7144 51.8807 80.2156 56.7549 80.2156 62.7625C80.2156 68.7701 78.7144 73.6363 76.8566 73.6363ZM85.8386 73.6363C84.5946 73.6363 83.5827 68.7701 83.5827 62.7625C83.5827 56.7549 84.5946 51.8807 85.8386 51.8807C87.0743 51.8807 88.0862 56.7549 88.0862 62.7625C88.0862 68.7701 87.0743 73.6363 85.8386 73.6363ZM94.2898 70.696C92.8301 70.696 91.6524 66.8758 91.6524 62.1601C91.6524 57.4524 92.8301 53.6322 94.2898 53.6322C95.7494 53.6322 96.9271 57.4524 96.9271 62.1601C96.9271 66.8758 95.7494 70.696 94.2898 70.696ZM102.476 28.5241C102.476 35.9899 96.1475 42.0451 88.335 42.0451H52.092C44.2794 42.0451 37.9432 35.9899 37.9432 28.5241V26.0196C37.9432 18.5537 44.2794 12.5065 52.092 12.5065H88.335C96.1475 12.5065 102.476 18.5537 102.476 26.0196V28.5241Z"
            fill="#30A549"
          />
          <path
            d="M56.5438 39.2559C63.4694 39.2559 69.0837 33.8908 69.0837 27.2725C69.0837 20.6542 63.4694 15.2891 56.5438 15.2891C49.6182 15.2891 44.0039 20.6542 44.0039 27.2725C44.0039 33.8908 49.6182 39.2559 56.5438 39.2559Z"
            fill="#27763B"
          />
          <path
            d="M57.4169 36.0293C62.4416 36.0293 66.515 32.1367 66.515 27.335C66.515 22.5332 62.4416 18.6406 57.4169 18.6406C52.3922 18.6406 48.3188 22.5332 48.3188 27.335C48.3188 32.1367 52.3922 36.0293 57.4169 36.0293Z"
            fill="#3A3A3A"
          />
          <path
            d="M56.6647 30.9575C58.7717 30.9575 60.4797 29.3253 60.4797 27.3118C60.4797 25.2983 58.7717 23.666 56.6647 23.666C54.5577 23.666 52.8496 25.2983 52.8496 27.3118C52.8496 29.3253 54.5577 30.9575 56.6647 30.9575Z"
            fill="white"
          />
          <path
            d="M86.9598 39.2559C93.8854 39.2559 99.4997 33.8908 99.4997 27.2725C99.4997 20.6542 93.8854 15.2891 86.9598 15.2891C80.0342 15.2891 74.4199 20.6542 74.4199 27.2725C74.4199 33.8908 80.0342 39.2559 86.9598 39.2559Z"
            fill="#27763B"
          />
          <path
            d="M85.4574 36.0293C90.4822 36.0293 94.5555 32.1367 94.5555 27.335C94.5555 22.5332 90.4822 18.6406 85.4574 18.6406C80.4327 18.6406 76.3594 22.5332 76.3594 27.335C76.3594 32.1367 80.4327 36.0293 85.4574 36.0293Z"
            fill="#3A3A3A"
          />
          <path
            d="M84.4894 30.9575C86.5964 30.9575 88.3044 29.3253 88.3044 27.3118C88.3044 25.2983 86.5964 23.666 84.4894 23.666C82.3824 23.666 80.6743 25.2983 80.6743 27.3118C80.6743 29.3253 82.3824 30.9575 84.4894 30.9575Z"
            fill="white"
          />
        </svg>
      </div>
      <p className="select-none text-3xl font-bold">在空白處點兩下開始發想。</p>
    </div>
  );
};

const NewJourney = () => {
  const { screenToFlowPosition } = useReactFlow();
  const [firstVisit, setFirstVisit] = useState(true);
  const {
    nodeList,
    edgeList,
    levelOneHintListType1,
    levelOneHintListType2,
    addNode,
    addEdge,
    updateNode,
    updateNodePosition
  } = useClusterPosition();
  const initStatus = () => {
    setFirstVisit(false);
  };

  const onNodesChange = (event: NodeChange[]) => {
    // console.log("NodeChange", event[0]);
    const selectNode = event[0] as Node;
    if (selectNode.dragging) {
      updateNodePosition(selectNode.id, selectNode.position!.x, selectNode.position!.y);
    }
  };

  const onAdd = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const levelOne = localStorage.getItem("choice") === "0" ? levelOneHintListType1 : levelOneHintListType2;
    let bubbleCount = localStorage.getItem("levelOneBubble");
    if (!bubbleCount) {
      localStorage.setItem("levelOneBubble", "0");
      bubbleCount = "0";
    } else {
      localStorage.setItem("levelOneBubble", ((parseInt(bubbleCount!) + 1) % levelOne.length).toString());
    }
    const NodeId = `level1_${+new Date()}`;
    const newNode: Node = {
      id: NodeId,
      type: "bubble",
      data: {
        id: NodeId,
        label: levelOne[parseInt(bubbleCount!)],
        position: screenToFlowPosition({
          x: event.clientX - 80,
          y: event.clientY - 80
        }),
        parentNode: "",
        level: 1
      },
      position: screenToFlowPosition({
        x: event.clientX - 80,
        y: event.clientY - 80
      }),
      parentNode: ""
    };
    addNode(newNode);
  };

  // target is the node that the node is dragged over
  const [target, setTarget] = useState<Node>();
  const [dragRef, setDragRef] = useState<Node>();
  const onNodeDragStart = (event: React.MouseEvent<Element, MouseEvent>, node: Node) => {
    setDragRef(node);
  };

  const onNodeDrag = (event: React.MouseEvent<Element, MouseEvent>, node: Node) => {
    // calculate the center point of the node from position and dimensions

    const targetNode = nodeList.filter((n) => {
      if (n.parentNode === "") {
        const xDistance = node.position.x - n.position.x;
        const yDistance = node.position.y - n.position.y;
        const centersDistance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);

        if (centersDistance <= 2 * 80 && node.id != n.id) {
          return n;
        }
      }
    })[0];

    setTarget(targetNode);
  };

  const onNodeDragStop = (event: React.MouseEvent<Element, MouseEvent> | undefined, node: Node) => {
    // on drag stop, we swap the colors of the nodes
    console.log(event);
    if (target) {
      if (target.data.level !== 1 || dragRef?.data.level !== 1) {
        return;
      }
      const NodeId = `level0_${+new Date()}`;
      const newNode: Node = {
        id: NodeId,
        type: "cluster",
        data: {},
        position: screenToFlowPosition({
          x: dragRef.position.x,
          y: dragRef.position.y
        }),
        parentNode: ""
      };
      addNode(newNode);

      // const clusterNode = nodeList.filter((item) => item.type === "cluster")[0];
      // const newCluster = { ...clusterNode };
      // const NodeId = newCluster.id.toString();
      // newCluster.position = {
      //   x: node.position.x - 150,
      //   y: node.position.y - 200
      // };
      // updateNode(newCluster);
      const newTarget = { ...target };
      newTarget.parentNode = NodeId;
      newTarget.position = screenToFlowPosition({
        x: dragRef.position.x,
        y: dragRef.position.y
      });
      newTarget.dragging = false;
      newTarget.extent = "parent";
      updateNode(newTarget);
      let EdgeId = `randomedge_${+new Date()}`;
      let newEdge: Edge = {
        id: EdgeId,
        source: NodeId,
        target: target.id,
        style: { stroke: "#22C55E", strokeWidth: "3" }
      };
      addEdge(newEdge);

      const newDragRef: Node = { ...dragRef! };
      newDragRef.parentNode = NodeId;
      newDragRef.position = screenToFlowPosition({
        x: dragRef.position.x,
        y: dragRef.position.y
      });
      newDragRef.dragging = false;
      newDragRef.extent = "parent";
      console.log(newDragRef);
      updateNode(newDragRef);
      EdgeId = `randomedge_${+new Date()}`;
      newEdge = {
        id: EdgeId,
        source: NodeId,
        target: dragRef!.id,
        style: { stroke: "#22C55E", strokeWidth: "3" }
      };
      addEdge(newEdge);
    }
    setTarget(undefined);
    setDragRef(undefined);
  };
  const [isChecked, setIsChecked] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("choice")) {
      setIsChecked(localStorage.getItem("choice") === "1" ? true : false);
    } else {
      localStorage.setItem("choice", "0");

      setIsChecked(false);
    }
  }, []);
  const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
    if (checked) {
      localStorage.setItem("choice", "1");
    } else {
      localStorage.setItem("choice", "0");
    }
    setIsChecked(checked);
  };
  return (
    <div
      className="flex h-[calc(100vh-96px)] w-full flex-col items-center justify-center"
      onDoubleClick={(event) => onAdd(event)}
    >
      <div className="m-2 flex gap-2">
        <p>情境1</p>
        <Switch checked={isChecked} onChange={onChange} />
        <p>情境2</p>
      </div>
      {nodeList.length === 0 ? (
        <FirstVisit />
      ) : (
        <ReactFlow
          nodes={nodeList}
          edges={edgeList}
          nodeTypes={nodeTypes}
          onNodesChange={(event) => onNodesChange(event)}
          onNodeDragStart={(event, node) => onNodeDragStart(event, node)}
          onNodeDrag={(event, node) => onNodeDrag(event, node)}
          onNodeDragStop={(event, node) => onNodeDragStop(event, node)}
          zoomOnDoubleClick={false}
        >
          <Controls />
          <MiniMap />
        </ReactFlow>
      )}
    </div>
  );
};

const Output_NewJourney = () => {
  return (
    <ReactFlowProvider>
      <NewJourney />
    </ReactFlowProvider>
  );
};

export default Output_NewJourney;
