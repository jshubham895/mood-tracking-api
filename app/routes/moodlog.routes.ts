import { Router } from "express";
import { validate } from "express-validation";
import moodLogValidation from "../validations/moodlog.validation";
import validateToken from "../middlewares/authMiddleware";
import {
	deleteMoodLog,
	filterMoodLogs,
	getMonthlySummary,
	logMood,
	updateMoodLog
} from "../controllers/moodLogController";

const router = Router();

router
	.route("/log")
	.post(validate(moodLogValidation.create), validateToken, logMood);

router
	.route("/summary")
	.get(validate(moodLogValidation.summary), validateToken, getMonthlySummary);

router
	.route("/log/:id")
	.put(validate(moodLogValidation.update), validateToken, updateMoodLog)
	.delete(validate(moodLogValidation.delete), validateToken, deleteMoodLog);

router
	.route("/filter")
	.get(validate(moodLogValidation.filter), validateToken, filterMoodLogs);

export default router;
