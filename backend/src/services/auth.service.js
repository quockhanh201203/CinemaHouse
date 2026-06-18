import bcrypt from "bcryptjs";

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { signAccessToken } from "../utils/token.js";

export const registerUser = async ({ fullName, dateOfBirth, email, password }) => {
  if (!fullName || !dateOfBirth || !email || !password) {
    throw new ApiError(400, "Vui lòng nhập đầy đủ thông tin đăng ký");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existedUser = await User.findOne({ email: normalizedEmail });

  if (existedUser) {
    throw new ApiError(400, "Email đã được sử dụng");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    fullName,
    dateOfBirth,
    email: normalizedEmail,
    password: hashedPassword
  });
  const token = signAccessToken(user);

  return { user, token };
};

export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new ApiError(400, "Email/phone and password are required");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email/phone or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email/phone or password");
  }

  const token = signAccessToken(user);
  const safeUser = await User.findById(user._id);

  return { user: safeUser, token };
};

export const getProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};
