import { Router } from "express";
import auth from "../../middlewares/auth";
import { ChatControllers } from "./chat.controllers";

const router = Router();

// Create Chat
router.post("/create", auth(), ChatControllers.createChat);
router.get("/:receiverId", auth(), ChatControllers.getAllChat);

export const ChatRoutes = router;
