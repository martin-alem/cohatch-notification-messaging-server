import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import "./database/connection.js";
import redisClient from "./database/redis.js";

import onlineUsersRouter from "./routes/onlineUsersRouter.js";
import assignRoom from "./controllers/assignRoom.js";
import privateChat from "./controllers/privateChat.js";
import handleOnlineStatus from "./controllers/handleOnlineStatus.js";
import handleMessages from "./controllers/handleMessages.js";
import messagesRouter from "./routes/messageRouter.js";
import chatRouter from "./routes/chatsRouter.js";

//Read environment variable from .env
dotenv.config();

const app = express();

//Express Cors Configuration
const corsOptions = {
  origin: process.env.ALLOWED_DOMAIN,
  credentials: true,
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Origin"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cookieParser());
app.enable("trust proxy");
app.use(cors(corsOptions));
app.use(express.json());

//Setting up socket IO server
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.ALLOWED_DOMAIN,
    methods: ["GET", "POST", "DELETE", "OPTIONS", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Origin"],
    credentials: true,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  },
});

const onConnection = socket => {
  assignRoom(io, socket);
  privateChat(io, socket);
};

io.on("connection", onConnection);

//Subscribe to redis server
(async function () {
  const subscriber = redisClient.duplicate();
  await subscriber.connect();
  await subscriber.SUBSCRIBE("online_status", data => handleOnlineStatus(io, data));
  await subscriber.SUBSCRIBE("message", data => handleMessages(io, data));
})();

//Online users
app.use("/api/v1/online_users", onlineUsersRouter);

//Messages endpoint
app.use("/api/v1/messages", messagesRouter);

//Recent endpoint
app.use("/api/v1/recent_chats", chatRouter);

//Ping routes to check server status
app.get("/api/ping", (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Server up and running",
  });
});

//Bad route handler
app.all("*", (req, res) => {
  res.status(404).json({
    status: 404,
    message: `${req.url} resource not found on this server`,
  });
});

const PORT = process.env.PORT || `8080`;
httpServer.listen(PORT, () => {
  console.log(`Messaging Server Listening On Port ${PORT}`);
});
