import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  BCRYPT_SALt_ROUNDS: process.env.BCRYPT_SALt_ROUNDS,
  EMAIL_USER: process.env.EMAIL_USER,
  SM_PASS: process.env.SM_PASS,
  JWT: {
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_ACCESS_SECRET_EXPIRES_IN: process.env.JWT_ACCESS_SECRET_EXPIRES_IN,
    JWT_ACTIVE_ACCOUNT_SECRET: process.env.JWT_ACTIVE_ACCOUNT_SECRET,
    JWT_ACTIVE_ACCOUNT_SECRET_EXPIRES_IN:
      process.env.JWT_ACTIVE_ACCOUNT_SECRET_EXPIRES_IN,
  },
};
