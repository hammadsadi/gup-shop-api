import status from "http-status";
import { IAuth } from "../../interfaces";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { ChatServices } from "./chat.services";

// Create Chat
const createChat = catchAsync(
  async (req: Request & { user?: IAuth }, res: Response) => {
    const { id } = req?.user as IAuth;
    const result = await ChatServices.chatSaveToDB(req.body, id);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Chat Created success",
      data: result,
    });
  }
);

// Get All Chat
const getAllChat = catchAsync(
  async (req: Request & { user?: IAuth }, res: Response) => {
    const { id } = req?.user as IAuth;
    const receiverId = req.params?.receiverId;

    const result = await ChatServices.getAllChats(id, receiverId);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Chats Fetched success",
      data: result,
    });
  }
);

export const ChatControllers = {
  createChat,
  getAllChat,
};
