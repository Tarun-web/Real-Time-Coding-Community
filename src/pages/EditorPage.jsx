import React, { useEffect, useRef, useState } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor/Editor";
import "./EditorPage.css";
import { initSocket } from "../socket";
import { ACTIONS } from "../Actions";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-hot-toast";

const EditorPage = () => {
  const location = useLocation();
  const reactNavigate = useNavigate();
  const { roomId } = useParams();
  const codeRef = useRef(null);
  //state
  const [clients, setClients] = useState([]);

  //creating a ref for socket initialization.ref dotn re-render the component
  const socketRef = useRef(null);
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();

      //error handling
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later");
        reactNavigate("/");
      }
      // console.log("codername", location.state?.coderName);
      //join event
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        coderName: location.state?.coderName,
      });

      //LIstening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, coderName, socketId }) => {
          if (coderName !== location.state?.coderName) {
            toast.success(`${coderName} joined the Coderoom`);
            console.log(`${coderName}`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      //LIStening for disconnected users
      socketRef.current.on(ACTIONS.DISCONNECTED, (socketId, coderName) => {
        toast.success(`${coderName} left the Coderoom.`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();

    //cleanup events and turning off the socket after use
    return () => {
      // socketRef.current.disconnect();
      // socketRef.current.off(ACTIONS.JOINED);
      // socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  //TO COPY THE ROOMID
  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Coderoom ID has been copied to the clipboard");
    } catch (error) {
      toast.error("Could not copy Coderoom Id");
    }
  }

  //TO LEAVE THE ROOM
  function leaveRoom() {
    reactNavigate("/");
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="aside-inner">
          <div className="logo">
            <img
              src="/logo.svg"
              alt="Logo Pic"
              className="logoImage"
              width={100}
            />
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
            {clients.map((client) => (
              <Client key={client.socketId} coderName={client.coderName} />
            ))}
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyRoomId}>
          Copy ROOM ID
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>
      <div className="editorWrap">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;
