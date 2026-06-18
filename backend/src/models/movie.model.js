import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true
    },
    director: {
      type: String,
      trim: true,
      default: ""
    },
    cast: {
      type: String,
      trim: true,
      default: ""
    },
    genre: {
      type: String,
      trim: true,
      default: ""
    },
    audio_language: {
      type: String,
      enum: ["Tiếng Anh", "Tiếng Việt"],
      required: [true, "Audio language is required"],
      default: "Tiếng Việt"
    },
    subtitle_language: {
      type: String,
      enum: ["Tiếng Anh", "Tiếng Việt"],
      required: [true, "Subtitle language is required"],
      default: "Tiếng Việt"
    },
    rated: {
      type: String,
      enum: ["Không hạn chế", "16+", "18+"],
      required: [true, "Rated is required"],
      default: "Không hạn chế"
    },
    duration: {
      type: Number,
      enum: [120, 240, 360],
      required: [true, "Duration is required"]
    },
    release_date: {
      type: Date,
      required: [true, "Release date is required"],
      validate: {
        validator(value) {
          return value > new Date();
        },
        message: "Release date must be in the future"
      }
    },
    poster_url: {
      type: String,
      required: [true, "Poster URL is required"],
      trim: true
    },
    trailer_url: {
      type: String,
      trim: true,
      default: ""
    },
    status: {
      type: String,
      enum: ["dang_chieu", "sap_chieu"],
      default: "sap_chieu"
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      }
    }
  }
);

movieSchema.index({ title: "text", description: "text" });
movieSchema.index({ status: 1, release_date: -1 });

export const Movie = mongoose.model("Movie", movieSchema);
