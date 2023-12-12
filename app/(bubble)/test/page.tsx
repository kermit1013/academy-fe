"use client";
import { useState, useEffect } from "react";
import * as io from "socket.io-client";

const Chat = () => {
  const projectID = "12312313223";

  const [nodes, setNodes] = useState("loading...");
  const [edges, setEdges] = useState("loading...");

  const [socket, setSocket] = useState();

  //connect to socket
  useEffect(() => {
    const s = io("http://139.162.82.246:8085/", {
      reconnection: false,
      query: "room=" + projectID
    });
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, [projectID]);

  //get project
  useEffect(() => {
    if (projectID !== undefined && socket !== undefined) {
      console.log(socket);
      socket.emit("project_get", {
        room: projectID
      });
    }
  }, [projectID, socket]);

  //auto saver
  useEffect(() => {
    console.log(socket);
    if (socket === undefined || nodes === "loading..." || edges === "loading...") return;
    const interval = setInterval(() => {
      socket.emit("project_save", {
        room: projectID,
        nodes: nodes,
        edges: edges
      });
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [socket, nodes, edges]);

  const onNodeChange = (value) => {
    setNodes(value);
    notifyChange(value, "NODE");
  };

  const onEdgeChange = (value) => {
    setEdges(value);
    notifyChange(value, "EDGE");
  };

  const notifyChange = (value, type) => {
    console.log(socket);
    socket.emit("project_write", {
      data: value,
      room: projectID,
      type: type
    });
  };

  useEffect(() => {
    if (socket == null) return;
    console.log(socket);
    const project_read = ({ data, type }) => {
      // setValues({ ...values, [type.toLowerCase()]: data });
      switch (type) {
        case "NODE":
          setNodes(data);
          break;
        case "EDGE":
          setEdges(data);
          break;
      }
    };

    const project_retrieve = (data) => {
      const jsonData = JSON.parse(data);
      setNodes(jsonData.nodes);
      setEdges(jsonData.edges);
    };

    socket.on("project_read", project_read);
    socket.on("project_retrieved", project_retrieve);

    return () => {
      socket.off("project_read", project_read);
      socket.off("project_retrieved", project_retrieve);
    };
  }, [socket]);

  return (
    <div>
      {/* Display the messages */}
      <p>{nodes}</p>
      {/* Input field for sending new messages */}
      <input type="text" onChange={(e) => onNodeChange(e.target.value)} />

      {/* Button to submit the new message */}
      <p>{edges}</p>

      {/* Input field for sending new messages */}
      <input type="text" onChange={(e) => onEdgeChange(e.target.value)} />

      {/* Button to submit the new message */}
    </div>
  );
};

export default Chat;
