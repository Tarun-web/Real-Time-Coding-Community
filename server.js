import express from "express";
const app = express();
import http from "http";

import { Server } from "socket.io";
import { ACTIONS } from "./src/Actions.js";

const server = http.createServer(app);

//creating instance of Server with server
const io = new Server(server);

const userSocketMap = {};

// it returns a map which is converted to a array
function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        coderName: userSocketMap[socketId],
      };
    }
  );
}

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, coderName }) => {
    console.log(coderName);
    //storing in a map
    userSocketMap[socket.id] = coderName;

    //join
    socket.join(roomId);

    //getting new connecting clients and notifying
    const clients = getAllConnectedClients(roomId);

    //notifying the client who has jouned with socketid
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        coderName,
        socketId: socket.id,
      });
    });
  });

  //CODE CHANGE
  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {
      code,
    });
  });

  //CODE CHANGE
  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  //on disconnecting
  socket.on("disconnecting", () => {
    //converting map to array
    const rooms = [...socket.rooms];
    console.log(rooms);
    //notifying all clients that a client is disconnected
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        coderName: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id]; //delete disconnected user
    socket.leave(); //to get out of the room
  });
});

const PORT = process.env.VITE_PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
