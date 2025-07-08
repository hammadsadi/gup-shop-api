import http from "http";
import app from "./app";
import config from "./app/config";
import { Server as SocketIOServer } from "socket.io";
import { socketHandler } from "./app/sockets";

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: { origin: "http://localhost:5173", credentials: true },
});

socketHandler(io);

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
