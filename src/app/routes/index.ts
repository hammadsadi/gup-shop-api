import express from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { ChatRoutes } from "../modules/chat/chat.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/chat",
    route: ChatRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
