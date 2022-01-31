import express from "express";
import getMessages from "./../controllers/getMessages.js";
import authMiddleware from "./../middleware/authMiddleware.js";

const messagesRouter = express.Router();

messagesRouter.get("/:senderLastName/:recipientLastName", [authMiddleware, getMessages]);

//Catch all exceptions thrown by this router
messagesRouter.use((error, req, res, next) => {
  res.status(error.statusCode).json({
    status: "fail",
    statusCode: error.statusCode,
    message: error.message,
  });
});
export default messagesRouter;
