import redisClient from "./../database/redis.js";

function privateChat(io, socket) {
  try {
    socket.on("message", payload => {
      redisClient.PUBLISH("message", JSON.stringify(payload));
    });
  } catch (error) {
    console.error(error);
  }
}

export default privateChat;
