"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  getRectOfNodes,
  useViewport,
  getTransformForBounds,
  useNodes,
  useReactFlow,
  ReactFlowProvider,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
  BackgroundVariant,
  Controls,
  Background
} from "reactflow";
import { message } from "antd";
import * as io from "socket.io-client";
import "reactflow/dist/style.css";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

import Bubble from "@/components/bubble/Bubble_V2";
import Cluster from "@/components/bubble/Cluster";
import useBubble from "@/hooks/useBubble";

import { toPng } from "html-to-image";

const TryConnectPage = () => {
  return (
    <div className=" absolute top-0 flex h-screen w-screen items-center justify-center bg-gray-100">
      <p className="text-3xl font-bold">稍等一下，連線好朋友跟你一起發想 ...</p>
    </div>
  );
};

const nodeTypes = {
  bubble: Bubble,
  cluster: Cluster
};

const AddNodeOnEdgeDrop = () => {
  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);
  const router = useRouter();

  const [messageApi, contextHolder] = message.useMessage();
  const useNode = useNodes();
  const { screenToFlowPosition, getNodes } = useReactFlow();
  const { x, y, zoom } = useViewport();
  const [socket, setSocket] = useState();

  const [title1, setTitle1] = useState("");
  const [title2, setTitle2] = useState("");
  const [myRound, setMyRound] = useState(false);

  const [try_connecting, setTryConnecting] = useState(false);
  const [modifyRoomText, setModifyRoomText] = useState("");
  const [roomId, setRoomId] = useState("");

  const { nodes, edges, setNode, setEdge, isConnect, isEdit, setMyRoomId, setImage, setConnect } = useBubble();

  // init
  useEffect(() => {
    const userName = localStorage.getItem("user_name");

    // Set Center Bubble
    const id = `level1_${uuidv4()}`;
    localStorage.setItem("center", id);
    const Center = {
      id: id,
      type: "bubble",
      data: {
        id: id,
        label: `十年後的${userName}`,
        position: { x: 0, y: 50 },
        center_id: id,
        parentNode: "",
        level: 1
      },
      position: { x: 0, y: 50 },
      parentNode: ""
    };

    setNode([Center]);

    // Set Title
    setTitle1("請透過心智圖來發想：");
    setTitle2("十年後理想中的你擁有哪些特質？（個人特質、理想生活等等）");
  }, []);

  // Node & Edge 's actions
  const onConnect = useCallback((params) => {
    // reset the start node on connections
    connectingNodeId.current = null;
  }, []);

  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd = useCallback(
    (event) => {
      if (!connectingNodeId.current) return;

      setMyRound(true);
      const targetIsPane = event.target.classList.contains("react-flow__pane");

      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = connectingNodeId.current.indexOf("level1") > -1 ? `level2_${uuidv4()}` : `level3_${uuidv4()}`;

        const newNode = {
          id,
          type: "bubble",
          data: {
            id: id,
            label: "",
            position: screenToFlowPosition({
              x: event.clientX + (300 * zoom) / 2,
              y: event.clientY - (80 * zoom) / 2
            }),
            center_id: localStorage.getItem("center"),
            level: connectingNodeId.current.indexOf("level1") > -1 ? 2 : 3
          },
          position: screenToFlowPosition({
            x: event.clientX + (300 * zoom) / 2,
            y: event.clientY - (80 * zoom) / 2
          }),
          origin: [0.5, 0.0]
        };
        const newNodeList = nodes.concat(newNode);
        setNode(newNodeList);
        const EdgeId = `${localStorage.getItem("center")}_${uuidv4()}`;
        const newEdge = {
          id: EdgeId,
          source: connectingNodeId.current,
          target: id,
          style: { stroke: "#22C55E", strokeWidth: "3" }
        };
        const newEdgeList = edges.concat(newEdge);
        setEdge(newEdgeList);
      }
    },
    [screenToFlowPosition, x, y, zoom, nodes, edges]
  );

  const onNodeDragStop = () => {
    setMyRound(true);
  };

  const onNodesDelete = useCallback(
    (deleted) => {
      if (deleted[0].id === localStorage.getItem("center")) {
        messageApi.open({
          type: "warning",
          content: "中心不可刪除!"
        });
        return;
      }

      deleted.reduce((acc, node) => {
        const incomers = getIncomers(node, nodes, edges);
        const outgoers = getOutgoers(node, nodes, edges);

        const connectedEdges = getConnectedEdges([node], edges);

        const remainingEdges = acc.filter((edge) => !connectedEdges.includes(edge));

        const createdEdges = incomers.flatMap(({ id: source }) =>
          outgoers.map(({ id: target }) => ({ id: `${source}->${target}`, source, target }))
        );
        setEdge([...remainingEdges, ...createdEdges]);
      }, edges);

      const newNodes = nodes.filter((node) => node.id !== deleted[0].id);
      setNode(newNodes);
    },
    [nodes, edges]
  );

  const onNodesChange = useCallback(
    (event) => {
      const selectNode = event[0];

      if (selectNode.dragging) {
        const updateNodeList = nodes.map((node) => {
          if (node.id == selectNode.id) {
            const newNode = { ...node, position: selectNode.position };
            return newNode;
          }
          return node;
        });
        setNode(updateNodeList);
      }
    },
    [nodes]
  );

  // connecting functions
  const handleConnectSocket = () => {
    if (modifyRoomText === "") {
      messageApi.open({
        type: "warning",
        content: "請輸入房號!"
      });
      return;
    }

    setTryConnecting(true);
    setRoomId(modifyRoomText);
  };

  const project_read = ({ data, type }) => {
    switch (type) {
      case "NODE":
        // setNodes(data);
        try {
          const nlist = JSON.parse(data);
          const newNList = nodes.concat(nlist);
          // setNodeList(newNList);

          const n_set = new Set();
          const n_result = newNList.reverse().filter((node) => (!n_set.has(node.id) ? n_set.add(node.id) : false));

          setNode(n_result.reverse());
        } catch (error) {
          const nlist = JSON.parse(data);
          setNode(nlist);
        }
        break;
      case "EDGE":
        // setEdges(data);
        try {
          const elist = JSON.parse(data);
          const newEList = edges.concat(elist);
          // setEdgeList(newEList);

          const e_set = new Set();
          const e_result = newEList
            .reverse()
            .filter((edge) => (!e_set.has(edge.id) ? e_set.add(edge.id) : false))
            .reverse();
          // const center_id = localStorage.getItem("center");
          // e_result.forEach((edge) => {
          //   edge.style = {
          //     stroke: edge.id.indexOf(center_id) == -1 ? "#F97316" : "#22C55E",
          //     strokeWidth: "3"
          //   };
          // });
          setEdge(e_result);
        } catch (error) {
          const elist = JSON.parse(data);

          setEdge(elist);
        }
        break;
    }

    if (!isConnect && try_connecting) {
      setTryConnecting(false);
      setConnect(true);
      setTitle1("Loudy幫你連線上一個好朋友，一起發想會有更多靈感！");
      setTitle2("如果你想要成為10年後理想的自己，你現在應該要做什麼樣的事（自主學習）呢？");
    }
  };

  const project_retrieve = (data) => {
    const jsonData = JSON.parse(data);

    setMyRoomId(jsonData.id);
    if (jsonData.nodes !== "") {
      const list = JSON.parse(jsonData.nodes);
      setNode(list);
    }
    if (jsonData.edges !== "") {
      const list = JSON.parse(jsonData.edges);
      setEdge(list);
    }
  };

  useEffect(() => {
    if (roomId !== "") {
      const s = io("https://socket.loudy.in/", {
        reconnection: false,
        query: "room=" + roomId
      });

      setSocket(s);
      return () => {
        s.disconnect();
      };
    }
  }, [roomId, try_connecting]);

  useEffect(() => {
    if (roomId !== undefined && socket !== undefined) {
      socket.emit("project_get", {
        room: roomId
      });
      socket?.emit("project_write", {
        data: JSON.stringify(nodes),
        room: roomId,
        type: "NODE"
      });
      socket?.emit("project_write", {
        data: JSON.stringify(edges),
        room: roomId,
        type: "EDGE"
      });
    }
  }, [roomId, socket]);

  useEffect(() => {
    if (socket === null || socket === undefined) return;

    socket?.on("project_read", project_read);
    socket?.on("project_retrieved", project_retrieve);

    return () => {
      // socket?.off("project_read", project_read);
      // socket?.off("project_retrieved", project_retrieve);
    };
  }, [socket]);

  useEffect(() => {
    if (socket === undefined) return;
    if (myRound === false) return;

    // socket?.emit("project_save", {
    //   room: roomId,
    //   nodes: JSON.stringify(nodeList),
    //   edges: JSON.stringify(edgeList)
    // });
    socket?.emit("project_write", {
      data: JSON.stringify(nodes),
      room: roomId,
      type: "NODE"
    });
    socket?.emit("project_write", {
      data: JSON.stringify(edges),
      room: roomId,
      type: "EDGE"
    });

    setMyRound(false);
  }, [myRound, nodes, edges]);

  // 下一步
  const handleGetResult = () => {
    const nodesBounds = getRectOfNodes(getNodes());

    const transform = getTransformForBounds(nodesBounds, window.innerWidth, window.innerHeight, 0.5, 2);
    toPng(document.getElementsByTagName("main")[0], {
      backgroundColor: "#FFFFFF",
      width: window.innerWidth,
      height: window.innerHeight,
      style: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`
    }).then((dataUrl) => {
      setImage(dataUrl);
    });

    socket?.off("project_read", project_read);
    socket?.off("project_retrieved", project_retrieve);
    router.push("/result");
  };

  return (
    <div className="h-screen w-screen" ref={reactFlowWrapper}>
      {contextHolder}
      <div className=" absolute top-0 z-50 flex h-32 w-full flex-col items-center justify-end gap-4">
        <p className="text-2xl font-bold">{title1}</p>
        <p className="text-2xl font-bold">{title2}</p>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={(event) => onNodesChange(event)}
        onNodeDragStop={onNodeDragStop}
        onNodesDelete={onNodesDelete}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        fitView
        fitViewOptions={{ padding: 2 }}
        nodeOrigin={[0.5, 0]}
        className="intersection-flow"
      >
        <Background gap={20} color="#f1f1f1" variant={BackgroundVariant.Lines} />
        <Controls />
      </ReactFlow>
      {useNode.length > 3 && !isConnect ? (
        <>
          <div className=" absolute left-10 top-6 z-50 flex gap-2 rounded-lg border-2 border-blue-300 bg-white p-2 text-xl font-bold">
            <p>房間編號:</p>
            <input
              type="text"
              disabled={try_connecting}
              onChange={(event) => {
                setModifyRoomText(event.target.value);
              }}
              className="rounded-md border-2 pl-2"
            />
          </div>
          <div className="absolute bottom-10 right-10">
            <button
              className="rounded-xl border border-green-400 bg-green-200 p-4 text-2xl hover:border-2"
              onClick={handleConnectSocket}
            >
              下一步
            </button>
          </div>
        </>
      ) : (
        <></>
      )}
      {useNode.length > 12 ? (
        <div className="absolute bottom-10 right-10">
          <button
            className="rounded-xl border border-green-400 bg-green-200 p-4 text-2xl hover:border-2"
            onClick={handleGetResult}
          >
            下一步
          </button>
        </div>
      ) : (
        <></>
      )}
      {try_connecting ? <TryConnectPage /> : <></>}
    </div>
  );
};

const FlowWithProvider = () => {
  return (
    <ReactFlowProvider>
      <AddNodeOnEdgeDrop />
    </ReactFlowProvider>
  );
};

export default FlowWithProvider;
