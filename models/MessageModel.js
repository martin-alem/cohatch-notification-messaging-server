import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  recipient: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  messageType: {
    type: String,
    required: true,
  },

  text: {
    type: String,
    required: true,
  },

  read: {
    type: Boolean,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },
});

export function createMessageCollection(customCollection) {
  const Chat = mongoose.model(customCollection, MessageSchema);
  Chat.createCollection();
}

export function getMessageModel(collection) {
  return mongoose.model(collection, MessageSchema);
}
