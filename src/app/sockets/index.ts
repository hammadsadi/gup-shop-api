import { Server } from "socket.io";
import { messageHandler } from "./handlers/messageHandler";
// import { userHandler } from "./handlers/userHandler";

// Set Active User an Array
let activeUsers: any = [];
// Create a new instance of the Socket.IO server
export const socketHandler = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Handle message events
    messageHandler(io, socket);
    // userHandler(io, socket);
    // Get User
    socket.on("newUser", (data) => {
      // Add the new user to the active users array
      const isExisting = activeUsers.some((user: any) => user.data === data);
      if (!isExisting) {
        activeUsers.push({ user: data, socketId: socket.id });
      }
      // Emit the updated active users to all connected clients
      io.emit("getAllActiveUsers", activeUsers);
    });
    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
      // Remove the disconnected user from the active users array
      activeUsers = activeUsers.filter(
        (user: any) => user.socketId !== socket.id
      );
      // Emit the updated active users to all connected clients
      io.emit("getAllActiveUsers", activeUsers);
    });
  });
};
