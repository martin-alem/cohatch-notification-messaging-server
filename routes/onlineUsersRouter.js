import express from "express";
import getOnlineUsersController from "./../controllers/getOnlineUsersController.js";
import authMiddleware from "./../middleware/authMiddleware.js";

const onlineUsersRouter = express.Router();

onlineUsersRouter.get("/", [authMiddleware, getOnlineUsersController]);

//Catch all exceptions thrown by this router
onlineUsersRouter.use((error, req, res, next) => {
  res.status(error.statusCode).json({
    status: "fail",
    statusCode: error.statusCode,
    message: error.message,
  });
});
export default onlineUsersRouter;
