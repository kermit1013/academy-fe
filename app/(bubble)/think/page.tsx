"use client";
import * as io from "socket.io-client";
import Bubble from "@/components/bubble/Bubble_Test";
import Cluster from "@/components/bubble/Cluster";
import useClusterPosition from "@/hooks/useClusterPosition";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, { Background, useReactFlow, ReactFlowProvider, Controls } from "reactflow";
import { v4 as uuidv4 } from "uuid";
import type { NodeChange, Edge, Node } from "reactflow";
import "reactflow/dist/style.css";

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
  const connectingNodeId = useRef<string | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  const [connecting, setConnecting] = useState(false);
  const [socket, setSocket] = useState();
  const [roomId, setRoomId] = useState("");
  const [myRound, setMyRound] = useState(false);
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
    setMyRoomId
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
      const s = io("http://139.162.82.246:8085/", {
        reconnection: false,
        query: "room=" + roomId
      });
      setSocket(s);
      setTimeout(() => {
        updateConnectStatus(true);
        setConnecting(false);
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
    }
  }, [roomId, socket]);

  // useEffect(() => {
  //   if (socket === undefined) return;
  //   if (!socket?.connected) return;

  //   const interval = setInterval(() => {
  //     socket?.emit("project_save", {
  //       room: roomId,
  //       nodes: JSON.stringify(nodeList),
  //       edges: JSON.stringify(edgeList)
  //     });
  //   }, 2000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [socket, nodeList, edgeList]);

  useEffect(() => {
    if (socket === null || socket === undefined) return;
    const project_read = ({ data, type }) => {
      switch (type) {
        case "NODE":
          console.log("NODE", JSON.parse(data) as Node[]);
          // setNodes(data);
          try {
            const nlist = JSON.parse(data) as Node[];
            const newNList = nodeList.concat(nlist);
            // setNodeList(newNList);

            const n_set = new Set();
            const n_result = newNList.reverse().filter((node) => (!n_set.has(node.id) ? n_set.add(node.id) : false));

            setNodeList(n_result.reverse());
          } catch (error) {
            console.log(error);
            const nlist = JSON.parse(data) as Node[];
            setNodeList(nlist);
          }
          break;
        case "EDGE":
          // setEdges(data);
          try {
            console.log("EDGE", JSON.parse(data));

            const elist = JSON.parse(data) as Edge[];
            const newEList = edgeList.concat(elist);
            // setEdgeList(newEList);

            const e_set = new Set();
            const e_result = newEList.reverse().filter((edge) => (!e_set.has(edge.id) ? e_set.add(edge.id) : false));
            const center_id = localStorage.getItem("center");
            const last_e_result = e_result.reverse().map((edge) => {
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
            console.log(error);

            const elist = JSON.parse(data) as Edge[];

            setEdgeList(elist);
          }
          break;
      }
    };

    const project_retrieve = (data) => {
      const jsonData = JSON.parse(data);
      console.log("data", data);
      console.log("jsonData.nodes", jsonData.nodes);
      console.log("jsonData.edges", jsonData.edges);
      if (jsonData.nodes !== "") {
        const list = JSON.parse(jsonData.nodes) as Node[];
        setNodeList(list);
      }
      if (jsonData.edges !== "") {
        const list = JSON.parse(jsonData.edges) as Edge[];
        setEdgeList(list);
      }
      // updateNodePosition(jsonData.nodes);
      // updateEdge(jsonData.edges);
    };

    socket.on("project_read", project_read);
    socket.on("project_retrieved", project_retrieve);

    return () => {
      // console.log("socket off");
      // socket.off("project_read", project_read);
      // socket.off("project_retrieved", project_retrieve);
    };
  }, [socket]);

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

  const onNodesChange = (event: NodeChange[]) => {
    // console.log("NodeChange", event[0]);
    const selectNode = event[0] as Node;
    if (selectNode.dragging) {
      updateNodePosition(selectNode.id, selectNode.position!.x, selectNode.position!.y);
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
    console.log("onConnectStart", nodeId);
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd = (event) => {
    setMyRound(true);
    if (!connectingNodeId.current) return;
    if (!isConnect && connectingNodeId.current.indexOf("level2") > -1) return;

    const targetIsPane = event.target.classList.contains("react-flow__pane");

    if (targetIsPane) {
      // we need to remove the wrapper bounds, in order to get the correct position
      const id = connectingNodeId.current.indexOf("level1") > -1 ? `level2_${uuidv4()}` : `level3_${uuidv4()}`;
      const newNode = {
        id: id,
        type: "bubble",
        data: {
          id: id,
          label: "",
          position: screenToFlowPosition({ x: event.clientX + 200, y: event.clientY - 25 }),
          parentNode: connectingNodeId.current,
          level: connectingNodeId.current.indexOf("level1") > -1 ? 2 : 3
        },
        position: screenToFlowPosition({ x: event.clientX + 200, y: event.clientY - 25 }),
        parentNode: connectingNodeId.current
      };
      addNode(newNode);
      const EdgeId = connectingNodeId.current ? `edge1to2_${uuidv4()}` : `edge2to3_${uuidv4()}`;
      const newEdge: Edge = {
        id: EdgeId,
        source: connectingNodeId.current,
        target: id,
        style: { stroke: "#22C55E", strokeWidth: "3" }
      };
      addEdge(newEdge);
      connectingNodeId.current = "";
    }
  };

  const handleConnectSocket = () => {
    setConnecting(true);
    setRoomId("123123");
  };
  return (
    <div className=" relative h-screen w-screen " ref={reactFlowWrapper}>
      <div className=" absolute top-0 flex h-32 w-full flex-col items-center justify-end gap-4 ">
        <p className="text-2xl font-bold">描述理想中十年後的你。</p>
        <p className="text-2xl font-bold">透過以下心智圖來發想，請填三個以上的特質。</p>
      </div>

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
