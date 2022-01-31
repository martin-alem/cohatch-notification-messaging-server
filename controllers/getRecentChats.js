import ErrorHandler from "./../utils/ErrorHandler.js";
import UserModel from "./../models/UserModel.js";
import ChatModel from "./../models/ChatModel.js";

async function getRecentChats(req, res, next) {
  try {
    const { userId } = req.params;
    const result = await ChatModel.find({ $or: [{ sender: userId }, { recipient: userId }] })
      .populate("sender", null, UserModel)
      .populate("recipient", null, UserModel);
    if (!result) return next(new ErrorHandler(403, "Unauthorized user"));
    res.status(200).json({
      status: "success",
      statusCode: 200,
      payload: result,
    });
  } catch (error) {
    next(new ErrorHandler(500, "Internal server error"));
  }
}

export default getRecentChats;
