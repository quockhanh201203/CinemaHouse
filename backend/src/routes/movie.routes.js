import { Router } from "express";

import * as movieController from "../controllers/movie.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", movieController.listMovies);
router.get("/:id", movieController.getMovieDetail);
router.post("/", authenticate, authorize("admin"), movieController.createMovie);
router.put("/:id", authenticate, authorize("admin"), movieController.updateMovie);
router.delete("/:id", authenticate, authorize("admin"), movieController.deleteMovie);

export default router;
