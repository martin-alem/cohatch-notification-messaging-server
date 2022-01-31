import redisClient from "./../database/redis.js";

function assignRoom(io, socket) {
  socket.on("join_room", async payload => {
    const { user } = payload;
    socket.join(user._id);
    await addToOnlineUser(user, socket.id);
  });

  socket.on("disconnect", async () => {
    await removeOnlineUser(socket.id);
  });
}

async function addToOnlineUser(user, socketId) {
  try {
    const key = user._id;
    user["socketId"] = socketId;
    const value = JSON.stringify(user);
    await redisClient.HSET("online_users", key, value);
  } catch (error) {
    console.error(error);
  }
}

async function removeOnlineUser(socketId) {
  try {
    const onlineUsers = await redisClient.HGETALL("online_users");
    for (const onlineUser in onlineUsers) {
      const user = JSON.parse(onlineUsers[onlineUser]);
      if (user["socketId"] === socketId) {
        redisClient.HDEL("online_users", onlineUser);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export default assignRoom;
