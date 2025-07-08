import { Socket, Server } from "socket.io";

export const messageHandler = (io: Server, socket: Socket) => {
  socket.on("send_message", (data) => {
    // message save Logic Or validation
    io.emit("receive_message", data);
  });
};
