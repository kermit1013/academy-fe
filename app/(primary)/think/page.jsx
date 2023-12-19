"use client";
import * as io from "socket.io-client";
import Bubble from "@/components/bubble/Bubble_Test";
import Cluster from "@/components/bubble/Cluster";
import { message } from "antd";
import useClusterPosition from "@/hooks/useClusterPosition";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  Background,
  useReactFlow,
  ReactFlowProvider,
  Controls,
  getRectOfNodes,
  getTransformForBounds
} from "reactflow";
import { v4 as uuidv4 } from "uuid";
import "reactflow/dist/style.css";
import { useRouter } from "next/navigation";
import { toPng } from "html-to-image";

const nodeTypes = {
  bubble: Bubble,
  cluster: Cluster
};

const TryConnectPage = () => {
  return (
    <div className=" absolute top-0 flex h-screen w-screen items-center justify-center bg-gray-100">
      <p className="text-3xl font-bold">稍等一下，連線好朋友跟你一起發想 ...</p>
    </div>
  );
};

const AddNodeOnEdgeDrop = () => {
  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);
  const { screenToFlowPosition, getNodes } = useReactFlow();
  const [connecting, setConnecting] = useState(false);
  const [socket, setSocket] = useState();
  const [roomId, setRoomId] = useState("");
  const [myRound, setMyRound] = useState(false);
  const [modifyRoomText, setModifyRoomText] = useState("");
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const {
    nodeList,
    edgeList,
    isConnect,
    isEdit,
    addNode,
    addEdge,
    setNodeList,
    setEdgeList,
    setIsEdit,
    updateNodePosition,
    updateConnectStatus,
    setMyRoomId,
    setImage
  } = useClusterPosition();

  useEffect(() => {
    const userName = localStorage.getItem("user_name");
    const id = `level1_${uuidv4()}`;
    localStorage.setItem("center", id);
    const Center = {
      id: id,
      type: "bubble",
      data: {
        id: id,
        label: `十年後的${userName}`,
        position: screenToFlowPosition({ x: 0, y: 50 }),
        center_id: id,
        parentNode: "",
        level: 1
      },
      position: screenToFlowPosition({ x: 0, y: 50 }),
      parentNode: ""
    };
    addNode(Center);
  }, []);

  useEffect(() => {
    if (roomId !== "") {
      const s = io("https://socket.loudy.in/", {
        reconnection: false,
        query: "room=" + roomId
      });
      setSocket(s);
      setTimeout(() => {
        updateConnectStatus(true);
        setConnecting(false);
        setTitle1("Loudy幫你連線上一個好朋友，一起發想會有更多靈感！");
        setTitle2("如果你想要成為10年後理想的自己，你現在應該要做什麼樣的事（自主學習）呢？");
      }, 2000);
      return () => {
        s.disconnect();
      };
    }
  }, [roomId, connecting]);

  useEffect(() => {
    if (roomId !== undefined && socket !== undefined) {
      socket.emit("project_get", {
        room: roomId
      });
      socket?.emit("project_write", {
        data: JSON.stringify(nodeList),
        room: roomId,
        type: "NODE"
      });
      socket?.emit("project_write", {
        data: JSON.stringify(edgeList),
        room: roomId,
        type: "EDGE"
      });
      console.log("sent data out");
    }
  }, [roomId, socket]);

  const project_read = ({ data, type }) => {
    switch (type) {
      case "NODE":
        // setNodes(data);
        try {
          const nlist = JSON.parse(data);
          const newNList = nodeList.concat(nlist);
          // setNodeList(newNList);

          const n_set = new Set();
          const n_result = newNList.reverse().filter((node) => (!n_set.has(node.id) ? n_set.add(node.id) : false));

          setNodeList(n_result.reverse());
        } catch (error) {
          const nlist = JSON.parse(data);
          setNodeList(nlist);
        }
        break;
      case "EDGE":
        // setEdges(data);
        try {
          const elist = JSON.parse(data);
          const newEList = edgeList.concat(elist);
          // setEdgeList(newEList);

          const e_set = new Set();
          const e_result = newEList.reverse().filter((edge) => (!e_set.has(edge.id) ? e_set.add(edge.id) : false));
          const center_id = localStorage.getItem("center");
          const last_e_result = e_result.reverse().map((edge) => {
            console.log(edge);
            if (edge.source !== center_id) {
              edge.style = {
                stroke: "#F97316",
                strokeWidth: "3"
              };
              return edge;
            }
            return edge;
          });
          setEdgeList(last_e_result);
        } catch (error) {
          const elist = JSON.parse(data);

          setEdgeList(elist);
        }
        break;
    }
  };

  const project_retrieve = (data) => {
    const jsonData = JSON.parse(data);
    console.log(jsonData.id);
    setMyRoomId(jsonData.id);
    if (jsonData.nodes !== "") {
      const list = JSON.parse(jsonData.nodes);
      setNodeList(list);
    }
    if (jsonData.edges !== "") {
      const list = JSON.parse(jsonData.edges);
      setEdgeList(list);
    }
    // updateNodePosition(jsonData.nodes);
    // updateEdge(jsonData.edges);
  };

  useEffect(() => {
    console.log(socket);
    if (socket === null || socket === undefined) return;
    if (!isConnect) return;
    console.log(socket);

    socket.on("project_read", project_read);
    socket.on("project_retrieved", project_retrieve);

    return () => {
      // console.log("socket off");
      // socket.off("project_read", project_read);
      // socket.off("project_retrieved", project_retrieve);
    };
  }, [socket, isConnect]);

  useEffect(() => {
    if (socket === undefined) return;
    if (myRound === false) return;
    console.log("emit ");
    // socket?.emit("project_save", {
    //   room: roomId,
    //   nodes: JSON.stringify(nodeList),
    //   edges: JSON.stringify(edgeList)
    // });
    socket?.emit("project_write", {
      data: JSON.stringify(nodeList),
      room: roomId,
      type: "NODE"
    });
    socket?.emit("project_write", {
      data: JSON.stringify(edgeList),
      room: roomId,
      type: "EDGE"
    });

    setMyRound(false);
  }, [myRound, nodeList, edgeList]);

  useEffect(() => {
    if (!isEdit) return;
    socket?.emit("project_write", {
      data: JSON.stringify(nodeList),
      room: roomId,
      type: "NODE"
    });
    setIsEdit(false);
  }, [isEdit]);

  const onNodesChange = (event) => {
    // console.log("NodeChange", event[0]);
    const selectNode = event[0];
    if (selectNode.dragging) {
      updateNodePosition(selectNode.id, selectNode.position.x, selectNode.position.y);
    }
  };

  const onNodeDragStop = () => {
    setMyRound(true);
  };
  const onConnect = useCallback((params) => {
    // reset the start node on connections
    connectingNodeId.current = null;
  }, []);

  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd = useCallback(
    (event) => {
      setMyRound(true);
      if (!connectingNodeId.current) return;
      if (!isConnect && connectingNodeId.current.indexOf("level2") > -1) return;

      const targetIsPane = event.target.classList.contains("react-flow__pane");

      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const position_padding =
          connectingNodeId.current.indexOf("level1") > -1 ? { x: 347, y: -115 } : { x: -50, y: -100 };
        console.log(position_padding);
        const id = connectingNodeId.current.indexOf("level1") > -1 ? `level2_${uuidv4()}` : `level3_${uuidv4()}`;
        const newNode = {
          id: id,
          type: "bubble",
          data: {
            id: id,
            label: "",
            position: screenToFlowPosition({
              x: event.clientX + position_padding.x,
              y: event.clientY + position_padding.y
            }),
            center_id: localStorage.getItem("center"),
            parentNode: connectingNodeId.current,
            level: connectingNodeId.current.indexOf("level1") > -1 ? 2 : 3
          },
          position: screenToFlowPosition({
            x: event.clientX + position_padding.x,
            y: event.clientY + position_padding.y
          }),
          parentNode: connectingNodeId.current
        };
        addNode(newNode);
        const EdgeId = connectingNodeId.current ? `edge1to2_${uuidv4()}` : `edge2to3_${uuidv4()}`;
        const newEdge = {
          id: EdgeId,
          source: connectingNodeId.current,
          target: id,
          style: { stroke: "#22C55E", strokeWidth: "3" }
        };
        addEdge(newEdge);
        connectingNodeId.current = "";
      }
    },
    [screenToFlowPosition, isConnect]
  );

  const handleConnectSocket = () => {
    if (modifyRoomText === "") {
      messageApi.open({
        type: "warning",
        content: "請輸入房號!"
      });
      return;
    }
    setConnecting(true);
    setRoomId(modifyRoomText);
  };

  const handleGetResult = () => {
    socket.off("project_read", project_read);
    socket.off("project_retrieved", project_retrieve);
    const nodesBounds = getRectOfNodes(getNodes());

    const transform = getTransformForBounds(nodesBounds, window.innerWidth, window.innerHeight, 0.5, 2);
    console.log(transform);
    toPng(document.getElementsByTagName("main")[0], {
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

    router.push("/result");
  };
  const [title1, setTitle1] = useState("");
  const [title2, setTitle2] = useState("");
  useEffect(() => {
    setTitle1("請透過心智圖來發想：");
    setTitle2("十年後理想中的你擁有哪些特質？");
  }, []);
  return (
    <div className=" relative h-screen w-screen " ref={reactFlowWrapper}>
      {contextHolder}
      <div className=" absolute top-0 flex h-32 w-full flex-col items-center justify-end gap-4 ">
        <p className="text-2xl font-bold">{title1}</p>
        <p className="text-2xl font-bold">{title2}</p>
      </div>
      {nodeList.length > 3 && !isConnect ? (
        <div className=" absolute left-10 top-6 z-50 flex gap-2 rounded-lg border-2 border-blue-300 bg-white p-2 text-xl font-bold">
          <p>房間編號:</p>
          <input
            type="text"
            onChange={(event) => {
              setModifyRoomText(event.target.value);
            }}
            className="rounded-md border-2 pl-2"
          />
        </div>
      ) : (
        <></>
      )}
      <ReactFlow
        nodes={nodeList}
        edges={edgeList}
        nodeTypes={nodeTypes}
        onNodesChange={(event) => onNodesChange(event)}
        onNodeDragStop={onNodeDragStop}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        zoomOnDoubleClick={false}
        fitView
        fitViewOptions={{ padding: 2 }}
        nodeOrigin={[0.5, 0]}
      >
        <Background />
        <Controls />
      </ReactFlow>
      {nodeList.length > 3 && !isConnect ? (
        <div className="absolute bottom-10 right-10">
          <button
            className="rounded-xl border border-green-400 bg-green-200 p-4 text-2xl hover:border-2"
            onClick={handleConnectSocket}
          >
            下一步
          </button>
        </div>
      ) : (
        <></>
      )}
      {nodeList.length > 12 ? (
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
      {connecting ? <TryConnectPage /> : <></>}
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
