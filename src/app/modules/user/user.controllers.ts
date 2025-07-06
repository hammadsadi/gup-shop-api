import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.services";
import { IAuth } from "../../interfaces";
import { Request, Response } from "express";
import config from "../../config";

const createUser = catchAsync(async (req, res) => {
  const result = await UserServices.userSaveToDB(req.body);

  // res.cookie("refreshToken", result.refreshToken, {
  //   secure: false,
  //   httpOnly: true,
  // });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User Register success",
    data: result,
  });
});

// Verify User Account By OTP
const verifyUserAccountByOtp = catchAsync(async (req, res) => {
  const { id, otp } = req.body;
  const result = await UserServices.verifyUserAccountByOtp(id, otp);

  res.cookie("gup-shup-tkn", result.accessToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User Account Verified success",
    data: result,
  });
});

// Resend OTP
const otpResend = catchAsync(async (req, res) => {
  const { id } = req.body;
  const result = await UserServices.resendOtp(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "OTP Resend success",
    data: result,
  });
});

// Get All Users
const allUsersGet = catchAsync(
  async (req: Request & { user?: IAuth }, res: Response) => {
    const { id } = req?.user as IAuth;
    const result = await UserServices.getAllUsers(id);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "User Retrieved success",
      data: result,
    });
  }
);
// Login User
const loginUser = catchAsync(async (req, res) => {
  const result = await UserServices.login(req.body);

  res.cookie("gup-shup-tkn", result.accessToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User Login success",
    data: result,
  });
});

// Get User Profile
const getMeUserInfo = catchAsync(
  async (req: Request & { user?: IAuth }, res: Response) => {
    const { id } = req?.user as IAuth;
    const result = await UserServices.getMe(id);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: " User Profile Retrieved success",
      data: result,
    });
  }
);

// Logout User
const logOutUser = catchAsync(async (req, res) => {
  res.clearCookie("gup-shup-tkn", {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "lax",
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User Logout success",
    data: "",
  });
});

// Update User Profile
// Get All Users
const updateUsersProfileInfo = catchAsync(
  async (req: Request & { user?: IAuth }, res: Response) => {
    const { id } = req?.user as IAuth;
    const { userId } = req.params;
    const result = await UserServices.updateUserProfile(userId, req.body, id);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "User Profile Updated success",
      data: result,
    });
  }
);
export const UserControllers = {
  createUser,
  allUsersGet,
  verifyUserAccountByOtp,
  otpResend,
  loginUser,
  getMeUserInfo,
  logOutUser,
  updateUsersProfileInfo,
};
