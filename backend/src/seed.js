import bcrypt from "bcryptjs";

import { connectDatabase } from "./config/database.js";
import { Movie } from "./models/movie.model.js";
import { User } from "./models/user.model.js";

const movies = [
  {
    title: "Lat Mat 8",
    description: "A Vietnamese cinema release for demo data.",
    director: "Nguyen Quang Dung",
    cast: "Khoi Nguyen, Nha Phuong",
    genre: "Hành động, Hài",
    audio_language: "Tiếng Việt",
    subtitle_language: "Tiếng Việt",
    rated: "Không hạn chế",
    duration: 120,
    release_date: new Date("2026-12-01"),
    poster_url: "https://example.com/posters/lat-mat-8.jpg",
    trailer_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    status: "dang_chieu"
  },
  {
    title: "Detective Conan Movie",
    description: "Mystery animation movie for cinema listing.",
    director: "Kenji Kodama",
    cast: "Shinichi Kudo, Ran Mouri",
    genre: "Hoạt hình, Bí ẩn",
    audio_language: "Tiếng Nhật",
    subtitle_language: "Tiếng Việt",
    rated: "16+",
    duration: 240,
    release_date: new Date("2026-11-15"),
    poster_url: "https://example.com/posters/conan.jpg",
    trailer_url: "",
    status: "sap_chieu"
  },
  {
    title: "Doraemon: Nobita Adventure",
    description: "Family animation movie coming soon.",
    director: "Hiroyuki Yamaga",
    cast: "Doraemon, Nobita, Shizuka",
    genre: "Hoạt hình, Gia đình",
    audio_language: "Tiếng Nhật",
    subtitle_language: "Tiếng Việt",
    rated: "Không hạn chế",
    duration: 360,
    release_date: new Date("2026-10-20"),
    poster_url: "https://example.com/posters/doraemon.jpg",
    trailer_url: "",
    status: "sap_chieu"
  }

];

const seed = async () => {
  await connectDatabase();

  await Movie.bulkWrite(
    movies.map((movie) => ({
      updateOne: {
        filter: { title: movie.title },
        update: { $set: movie },
        upsert: true
      }
    }))
  );

  const adminEmail = "admin@example.com";
  const existedAdmin = await User.findOne({ email: adminEmail });

  if (!existedAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 12);

    await User.create({
      fullName: "Admin",
      dateOfBirth: new Date("1990-01-01"),
      email: adminEmail,
      password: hashedPassword,
      role: "admin"
    });
  }

  console.log("Seed data completed");
  process.exit(0);
};

seed().catch((error) => {
  console.error("Seed data failed:", error.message);
  process.exit(1);
});
