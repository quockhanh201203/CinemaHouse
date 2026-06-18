import mongoose from "mongoose";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Họ và tên là bắt buộc"],
      trim: true,
      minlength: [2, "Họ và tên phải có ít nhất 2 ký tự"]
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Ngày sinh là bắt buộc"]
    },
    email: {
      type: String,
      required: [true, "Email là bắt buộc"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [emailRegex, "Email không hợp lệ"]
    },
    password: {
      type: String,
      required: [true, "Mật khẩu là bắt buộc"],
      select: false
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.password;
        return ret;
      }
    }
  }
);

export const User = mongoose.model("User", userSchema);
