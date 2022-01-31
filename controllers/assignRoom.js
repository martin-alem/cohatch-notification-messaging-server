import redisClient from "./../database/redis.js";

function assignRoom(io, socket) {
  try {
    socket.on("join_room", async payload => {
      const { user } = payload;
      socket.join(user._id);
      await addToOnlineUser(user, socket.id);
      user["event"] = "join";
      redisClient.PUBLISH("message", JSON.stringify(user));
    });

    socket.on("disconnect", async () => {
      const user = await removeOnlineUser(socket.id);
      if (user) {
        user["event"] = "leave";
        redisClient.PUBLISH("message", JSON.stringify(user));
      }
    });
  } catch (error) {
    console.error(error);
  }
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
        return user;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export default assignRoom;
