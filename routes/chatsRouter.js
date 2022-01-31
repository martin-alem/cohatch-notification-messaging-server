import express from "express";
import getRecentChats from "./../controllers/getRecentChats.js";
import authMiddleware from "./../middleware/authMiddleware.js";

const recentChatRouter = express.Router();

recentChatRouter.get("/:userId", [getRecentChats]);

//Catch all exceptions thrown by this router
recentChatRouter.use((error, req, res, next) => {
  res.status(error.statusCode).json({
    status: "fail",
    statusCode: error.statusCode,
    message: error.message,
  });
});
export default recentChatRouter;
