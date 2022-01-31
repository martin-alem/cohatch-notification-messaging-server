import ErrorHandler from "../utils/ErrorHandler.js";
import { uniqueCombination } from "./../utils/util.js";
import { getMessageModel } from "./../models/MessageModel.js";
import connection from "./../database/connection.js";
import ChatModel from "./../models/ChatModel.js";

async function handleMessages(io, data) {
  try {
    const payload = JSON.parse(data);
    const message = await saveMessage(payload);
    if (message) {
      const senderId = message["sender"]._id;
      const recipientId = message["recipient"]._id;
      io.to([senderId, recipientId]).emit("message", message);
    }
  } catch (error) {
    console.log(error);
  }
}

async function saveMessage(payload) {
  try {
    const { sender, recipient, message } = payload;
    const senderLastName = sender["lastName"];
    const recipientLastName = recipient["lastName"];
    const messageCollectionName = `${uniqueCombination(senderLastName, recipientLastName)}_messages`;
    const MessageModel = getMessageModel(messageCollectionName);
    const modifiedMessage = {
      sender: sender["_id"],
      recipient: recipient["_id"],
      messageType: "text",
      text: message,
      read: false,
      date: new Date(),
    };

    const session = await (await connection).startSession();
    let result = null;

    await session.withTransaction(async () => {
      const result1 = await MessageModel.create([modifiedMessage], { session: session });
      const lastMessage = result1[0]._id;
      const senderId = result1[0].sender;
      const recipientId = result1[0].recipient;
      const result2 = await ChatModel.findOneAndUpdate({ $and: [{ sender: senderId }, { recipient: recipientId }] }, { lastMessage }, { upsert: true });

      if (result1.length > 0 && result2) {
        const message = {
          sender,
          recipient,
          message: modifiedMessage["text"],
          time: modifiedMessage["date"],
        };
        result = message;
      }
    });
    session.endSession();
    return result;
  } catch (error) {
    return null;
  }
}

export default handleMessages;
