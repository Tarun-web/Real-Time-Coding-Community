import { useState } from "react";
import "./Home.css";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [coderName, setCoderName] = useState("");

  //CREATE ROOM
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);

    toast.success("Created New Room");
  };

  //JOIN ROOM
  const joinRoom = () => {
    if (!roomId || !coderName) {
      toast.error("Room ID and Coder Name is required");
      return;
    }
    //navigate to editor
    navigate(`/editor/${roomId}`, {
      state: {
        coderName,
      },
    });
  };

  //join on enter
  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="HomePageWrapper">
      <div className="formWrapper">
        <img src="logo.svg" alt="Code share logo" />
        <h4 className="mainLabel">Please Enter Room ID</h4>
        <div className="inputGroup">
          <input
            type="text"
            className="inputBox"
            placeholder="ROOM ID"
            id=""
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyUp={handleInputEnter}
          />
          <input
            type="text"
            className="inputBox"
            placeholder="CODERNAME"
            value={coderName}
            onChange={(e) => setCoderName(e.target.value)}
            onKeyUp={handleInputEnter}
          />
          {/**JOIN BUTTON */}
          <button onClick={joinRoom} className="btn joinBtn">
            Join
          </button>

          {/** */}
          <span className="createInfo">
            If you do not have any invite then create &nbsp;
            <a onClick={createNewRoom} href="#" className="createNewBtn">
              new room
            </a>
          </span>
        </div>
      </div>

      <footer>
        <h4>Built By - @tarunSharma</h4>
      </footer>
    </div>
  );
};

export default Home;
