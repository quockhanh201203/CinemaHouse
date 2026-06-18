import * as movieService from "../services/movie.service.js";
import { asyncHandler } from "../utils/async-handler.js";

export const listMovies = asyncHandler(async (req, res) => {
  const result = await movieService.getMovies(req.query);

  res.status(200).json({
    success: true,
    data: result.items,
    pagination: result.pagination
  });
});

export const getMovieDetail = asyncHandler(async (req, res) => {
  const movie = await movieService.getMovieById(req.params.id);

  res.status(200).json({
    success: true,
    data: movie
  });
});

export const createMovie = asyncHandler(async (req, res) => {
  const movie = await movieService.createMovie(req.body);

  res.status(201).json({
    success: true,
    message: "Movie created successfully",
    data: movie
  });
});

export const updateMovie = asyncHandler(async (req, res) => {
  const movie = await movieService.updateMovie(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: "Movie updated successfully",
    data: movie
  });
});

export const deleteMovie = asyncHandler(async (req, res) => {
  await movieService.deleteMovie(req.params.id);

  res.status(200).json({
    success: true,
    message: "Movie deleted successfully"
  });
});
