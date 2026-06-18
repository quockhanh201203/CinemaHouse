import jwt from "jsonwebtoken";

import { config } from "../config/env.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return req.cookies?.accessToken;
};

export const authenticate = asyncHandler(async (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    throw new ApiError(401, "Authentication token is required");
  }

  const decoded = jwt.verify(token, config.jwtSecret);
  const user = await User.findById(decoded.sub);

  if (!user) {
    throw new ApiError(401, "User no longer exists");
  }

  req.user = {
    id: user._id.toString(),
    role: user.role
  };

  next();
});

export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(new ApiError(403, "You do not have permission to access this resource"));
    }

    return next();
  };
