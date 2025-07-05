import { Router } from "express";
import { UserControllers } from "./user.controllers";
import auth from "../../middlewares/auth";

const router = Router();

// Create User
router.post("/register", UserControllers.createUser);
// Logout User
router.post("/logOut", UserControllers.logOutUser);
// Verify User Account By OTP
router.post("/verify-account", UserControllers.verifyUserAccountByOtp);
// Resend OTP
router.post("/resend-otp", UserControllers.otpResend);
// Login User
router.post("/login", UserControllers.loginUser);
// Get All Users
router.get("/", UserControllers.allUsersGet);
// Get Me
router.get("/me", auth(), UserControllers.getMeUserInfo);

export const UserRoutes = router;
