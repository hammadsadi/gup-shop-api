import { Server } from "socket.io";
import { messageHandler } from "./handlers/messageHandler";
// import { userHandler } from "./handlers/userHandler";

export const socketHandler = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Handle message events
    messageHandler(io, socket);
    // userHandler(io, socket);

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });
  });
};
