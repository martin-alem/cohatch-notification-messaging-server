import ErrorHandler from "./../utils/ErrorHandler.js";
import redisClient from "./../database/redis.js";

async function getOnlineUsersController(req, res, next) {
  try {
    const onlineUsers = await redisClient.HGETALL("online_users");
    if (!onlineUsers) return next(new ErrorHandler(500, "Internal server error"));
    res.status(200).json({
      status: "success",
      statusCode: 200,
      payload: onlineUsers,
    });
  } catch (error) {
    next(new ErrorHandler(500, "Internal server error"));
  }
}

export default getOnlineUsersController;
