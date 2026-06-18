import { Movie } from "../models/movie.model.js";
import { ApiError } from "../utils/api-error.js";

const allowedStatuses = ["dang_chieu", "sap_chieu"];

export const getMovies = async ({ status, search, page = 1, limit = 10 }) => {
  const query = {};

  if (status) {
    if (!allowedStatuses.includes(status)) {
      throw new ApiError(400, "Movie status must be dang_chieu or sap_chieu");
    }

    query.status = status;
  }

  if (search) {
    query.$text = { $search: search };
  }

  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    Movie.find(query).sort({ release_date: -1 }).skip(skip).limit(safeLimit),
    Movie.countDocuments(query)
  ]);

  return {
    items,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit)
    }
  };
};

export const createMovie = async (payload) => {
  return Movie.create(payload);
};

export const getMovieById = async (movieId) => {
  const movie = await Movie.findById(movieId);

  if (!movie) {
    throw new ApiError(404, "Movie not found");
  }

  return movie;
};

export const updateMovie = async (movieId, payload) => {
  const movie = await Movie.findByIdAndUpdate(movieId, payload, {
    new: true,
    runValidators: true
  });

  if (!movie) {
    throw new ApiError(404, "Movie not found");
  }

  return movie;
};

export const deleteMovie = async (movieId) => {
  const movie = await Movie.findByIdAndDelete(movieId);

  if (!movie) {
    throw new ApiError(404, "Movie not found");
  }

  return movie;
};
