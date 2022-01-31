import ErrorHandler from "./../utils/ErrorHandler.js";

async function handleMessages(io, data) {
  const { _id, event } = JSON.parse(data);
  io.except(_id).emit(event, data);
}

export default handleMessages;
