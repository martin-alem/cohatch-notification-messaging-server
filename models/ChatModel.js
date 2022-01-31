import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  recipient: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  lastMessage: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const Chat = mongoose.model("Chat", ChatSchema);

export default Chat;
