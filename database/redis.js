import { createClient } from "redis";

let redisClient = null;
(async function () {
  try {
    redisClient = createClient();
    redisClient.on("error", error => console.error(error));
    await redisClient.connect();
    console.log("connected to redis");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();

export default redisClient;
