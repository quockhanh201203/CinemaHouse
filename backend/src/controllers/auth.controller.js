import bcrypt from "bcryptjs";

import { config } from "../config/env.js";
import { User } from "../models/user.model.js";
import * as authService from "../services/auth.service.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const buildCookieOptions = () => ({
  httpOnly: true,
  secure: config.isProduction,
  sameSite: config.isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000
});

export const register = async (req, res) => {
  try {
    const { fullName, dateOfBirth, email, password, confirmPassword } = req.body;

    if (!fullName || !dateOfBirth || !email || !password || !confirmPassword) {
      throw new ApiError(400, "Vui lòng nhập đầy đủ thông tin đăng ký");
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!emailRegex.test(normalizedEmail)) {
      throw new ApiError(400, "Email không hợp lệ");
    }

    if (password !== confirmPassword) {
      throw new ApiError(400, "Mật khẩu xác nhận không khớp");
    }

    const parsedDateOfBirth = new Date(dateOfBirth);

    if (Number.isNaN(parsedDateOfBirth.getTime())) {
      throw new ApiError(400, "Ngày sinh không hợp lệ");
    }

    const existedUser = await User.findOne({ email: normalizedEmail });

    if (existedUser) {
      throw new ApiError(400, "Email đã được sử dụng");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      fullName,
      dateOfBirth: parsedDateOfBirth,
      email: normalizedEmail,
      password: hashedPassword
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "Đăng ký tài khoản thành công!",
      data: {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email đã được sử dụng"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ, vui lòng thử lại sau"
    });
  }
};

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.loginUser(req.body);

  res.cookie("accessToken", token, buildCookieOptions());

  res.status(200).json({
    success: true,
    message: "Login successfully",
    data: { user, token }
  });
});

export const me = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken", buildCookieOptions());

  res.status(200).json({
    success: true,
    message: "Logout successfully"
  });
});
