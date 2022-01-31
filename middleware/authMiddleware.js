import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";
import UserModel from "./../models/UserModel.js";

async function authMiddleware(req, res, next) {
  try {
    const { _access_token } = req.cookies;
    const JWT_SECRET = process.env.JWT_SECRET;
    try {
      const jwtPayLoad = jwt.verify(_access_token, JWT_SECRET);
      const { userId } = jwtPayLoad;
      const user = await UserModel.findOne({ _id: userId });
      if (!user) return next(new ErrorHandler(403, "User not found"));
      next();
    } catch (error) {
      console.error(error);
      next(new ErrorHandler(403, "Invalid access token"));
    }
  } catch (error) {}
}

export default authMiddleware;
