import { Chats } from "@prisma/client";
import prisma from "../../utils/prisma";

const chatSaveToDB = async (payload: any, authId: string) => {
  // Check Receiver is exist or not
  const isExistReceiver = await prisma.user.findUnique({
    where: {
      id: payload.receiverId,
    },
  });
  if (!isExistReceiver) {
    throw new Error("Receiver is not exist");
  }
  const result = await prisma.$transaction(async (tx) => {
    // Create Message
    const message = await tx.messages.create({
      data: {
        text: payload?.text,
      },
    });
    const chat = await tx.chats.create({
      data: {
        senderId: authId,
        receiverId: payload.receiverId,
        messageId: message.id,
      },
    });
    return chat;
  });
  return result;
};

// Get All Chat
const getAllChats = async (sederId: string, receiverId: string) => {
  const result = await prisma.chats.findMany({
    where: {
      OR: [
        {
          senderId: sederId,
          receiverId: receiverId,
        },
        {
          senderId: receiverId,
          receiverId: sederId,
        },
      ],
    },
    include: {
      message: true,
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          photo: true,
        },
      },
      receiver: {
        select: {
          id: true,
          name: true,
          email: true,
          photo: true,
        },
      },
    },
  });
  return result;
};
export const ChatServices = {
  chatSaveToDB,
  getAllChats,
};
