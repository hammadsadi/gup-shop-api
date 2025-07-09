import { User } from "@prisma/client";
import prisma from "../../utils/prisma";
import { generateToken } from "../../utils/auth.utils";
import config from "../../config";
import { generateOtp } from "../../utils/generateOtp";
import { getOtpEmailTemplate } from "../../utils/getOtpEmailTemplate";
import sendEmail from "../../utils/sendEmail";
import { jwtHelpers } from "../../utils/jwtHelpers";
import { Secret } from "jsonwebtoken";
import { AppError } from "../../errors/AppError";
import bcrypt from "bcryptjs";
import { generateUniqueUsername } from "../../utils/generateUniqueUsername";
// User Save to DB
const userSaveToDB = async (payload: User) => {
  // Check User Already Exist
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (isUserExist) {
    throw new Error("User Already Exist");
  }
  payload.username = await generateUniqueUsername(payload.name);

  // Hash Password
  payload.password = await bcrypt.hash(payload.password, 10);
  // Generate Image
  const imageUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${payload?.name}`;

  const result = await prisma.user.create({
    data: {
      ...payload,
      photo: imageUrl,
    },
  });
  const jwtPayload = {
    email: result.email,
    id: result.id,
    name: result.name,
  };
  const accessToken = generateToken(
    jwtPayload,
    config.JWT.JWT_ACTIVE_ACCOUNT_SECRET as string,
    config.JWT.JWT_ACTIVE_ACCOUNT_SECRET_EXPIRES_IN
  );
  // Check User Account Crate or Not
  if (!result) {
    throw new Error("User Account Not Created");
  }
  // Generate OTP
  const otp = generateOtp();

  // Set Account Active Link
  if (result) {
    // Update User Account Active Link
    await prisma.user.update({
      where: {
        email: result.email,
      },
      data: {
        ActiveToken: accessToken,
        otpCode: Number(otp),
      },
    });
  }
  // Send Email
  const emailTemp = getOtpEmailTemplate({
    userName: result.name,
    otpCode: otp,
    context: "Registration",
  });
  await sendEmail(result.email, emailTemp, "Verify Your Account");

  return {
    email: result.email,
    name: result.name,
    id: result.id,
  };
};

// Verify User Account By OTP
const verifyUserAccountByOtp = async (id: string, otp: number) => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!result) {
    throw new Error("User Not Found");
  }

  if (result.otpCode !== otp) {
    throw new Error("Invalid OTP");
  }

  // Check Account Access Token is Exist or Not
  const checkToken = jwtHelpers.verifyToken(
    result?.ActiveToken as string,
    config.JWT.JWT_ACTIVE_ACCOUNT_SECRET as Secret
  );
  if (!checkToken) {
    throw new AppError(401, "Otp Expired");
  }
  // Generate New Token
  const jwtPayload = {
    email: result.email,
    id: result.id,
    name: result.name,
  };
  const accessToken = generateToken(
    jwtPayload,
    config.JWT.JWT_ACCESS_SECRET as string,
    config.JWT.JWT_ACCESS_SECRET_EXPIRES_IN
  );
  await prisma.user.update({
    where: {
      id,
    },
    data: {
      isAccountActive: true,
      ActiveToken: null,
      otpCode: null,
    },
  });
  return {
    name: result.name,
    email: result.email,
    id: result.id,
    isAccountActive: result.isAccountActive,
    accessToken,
    photo: result?.photo,
    phone: result?.phone,
    username: result?.username,
  };
};

// Resend OTP
const resendOtp = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!result) {
    throw new AppError(404, "User Not Found");
  }
  // Generate Access Token
  const jwtPayload = {
    email: result.email,
    id: result.id,
    name: result.name,
  };
  const accessToken = generateToken(
    jwtPayload,
    config.JWT.JWT_ACTIVE_ACCOUNT_SECRET as string,
    config.JWT.JWT_ACTIVE_ACCOUNT_SECRET_EXPIRES_IN
  );
  // Generate OTP
  const otp = generateOtp();
  // Update User Account Active Link
  await prisma.user.update({
    where: {
      id,
    },
    data: {
      otpCode: Number(otp),
      ActiveToken: accessToken,
    },
  });
  // Send Email
  const emailTemp = getOtpEmailTemplate({
    userName: result.name,
    otpCode: otp,
    context: "Resend",
  });
  await sendEmail(result.email, emailTemp, "Verify Your Account");
  return {
    email: result.email,
    name: result.name,
    id: result.id,
  };
};

// Get All Users
const getAllUsers = async (authId: string) => {
  const result = await prisma.user.findMany({
    where: {
      isAccountActive: true,
      id: {
        not: authId,
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      photo: true,
      isAccountActive: true,
      phone: true,
      username: true,
      sentChats: {
        where: {
          receiverId: authId,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          message: true,
          createdAt: true,
          sender: {
            select: {
              id: true,
              name: true,
              photo: true,
              username: true,
            },
          },
        },
        take: 1,
      },
      receivedChats: {
        where: {
          senderId: authId,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          message: true,
          createdAt: true,
          sender: {
            select: {
              id: true,
              name: true,
              photo: true,
              username: true,
            },
          },
        },
        take: 1,
      },
    },
  });
  return result;
};

// Login User
const login = async (payload: User) => {
  const result = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (!result) {
    throw new Error("User Not Found");
  }
  if (result.isAccountActive === false) {
    throw new Error("User Account Not Active");
  }
  // Check Password
  const isPasswordMatch = await bcrypt.compare(
    payload.password,
    result.password
  );
  if (!isPasswordMatch) {
    throw new Error("Invalid Credentials!");
  }
  const jwtPayload = {
    email: result.email,
    id: result.id,
    name: result.name,
  };
  const accessToken = generateToken(
    jwtPayload,
    config.JWT.JWT_ACCESS_SECRET as string,
    config.JWT.JWT_ACCESS_SECRET_EXPIRES_IN
  );
  return {
    name: result.name,
    email: result.email,
    id: result.id,
    isAccountActive: result.isAccountActive,
    accessToken,
    photo: result?.photo,
    phone: result?.phone,
    username: result?.username,
  };
};

// Get Me Data
const getMe = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!result) {
    throw new Error("User Not Found");
  }
  return result;
};

// Update User Data
const updateUserProfile = async (id: string, payload: User, authId: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!result) {
    throw new Error("User Not Found");
  }
  if (result.id !== authId) {
    throw new Error("You are not authorized!");
  }
  // Username Check
  if (payload?.name) {
    payload.username = await generateUniqueUsername(payload.name);
  }

  // const isPasswordMatch = await bcrypt.compare(
  //   payload.password,
  //   result.password
  // );
  // if (!isPasswordMatch) {
  //   throw new Error("Invalid Credentials!");
  // }
  // const hashedPassword = await bcrypt.hash(payload.password, 10);
  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
  });
  return {
    name: updatedUser.name,
    email: updatedUser.email,
    id: updatedUser.id,
    isAccountActive: updatedUser.isAccountActive,
    photo: updatedUser?.photo,
    phone: updatedUser?.phone,
    username: updatedUser?.username,
  };
};

export const UserServices = {
  userSaveToDB,
  getAllUsers,
  verifyUserAccountByOtp,
  resendOtp,
  login,
  getMe,
  updateUserProfile,
};
