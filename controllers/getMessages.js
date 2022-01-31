import ErrorHandler from "./../utils/ErrorHandler.js";
import { getMessageModel } from "./../models/MessageModel.js";
import UserModel from "./../models/UserModel.js";
import { uniqueCombination } from "./../utils/util.js";

async function getMessages(req, res, next) {
  try {
    const { senderLastName, recipientLastName } = req.params;
    const messageCollectionName = `${uniqueCombination(senderLastName, recipientLastName)}_messages`;
    const MessageModel = getMessageModel(messageCollectionName);
    const result = await MessageModel.find({}, null, { sort: { date: -1 } })
      .populate("sender", null, UserModel)
      .populate("recipient", null, UserModel);
    if (!result) return next(new ErrorHandler(403, "Unauthorized user"));
    res.status(200).json({
      status: "success",
      statusCode: 200,
      payload: result,
    });
  } catch (error) {
    console.log(error);
    next(new ErrorHandler(500, "Internal server error"));
  }
}

export default getMessages;
