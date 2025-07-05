import { Response } from "express";

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  const responseData: {
    success: boolean;
    message?: string;
    data?: T;
  } = {
    success: data.success,
    message: data.message,
  };
  if (data.data !== null) {
    responseData.data = data.data;
  }
  res.status(data?.statusCode).json(responseData);
};

export default sendResponse;
