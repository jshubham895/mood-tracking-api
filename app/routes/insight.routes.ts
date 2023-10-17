import { Router } from "express";
import validateToken from "../middlewares/authMiddleware";
import {
	getInsights,
	getMoodBoardData
} from "../controllers/insightController";

const router = Router();

router.route("/get_insights").get(validateToken, getInsights);

router.route("/mood_board").get(validateToken, getMoodBoardData);

export default router;
