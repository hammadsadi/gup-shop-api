import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";
import router from "./app/routes";
const app: Application = express();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//  cors
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

// Testing
app.get("/", (req, res) => {
  res.send("GupShup Server is Running");
});
app.use("/api/v1", router);
// Global Error Handler
app.use(globalErrorHandler);
export default app;
