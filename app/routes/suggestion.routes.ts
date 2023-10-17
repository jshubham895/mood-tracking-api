import { Router } from "express";
import validateToken from "../middlewares/authMiddleware";
import { validate } from "express-validation";
import suggestionValidation from "../validations/suggestion.validation";
import { getSuggestions } from "../controllers/suggestionController";

const router = Router();

router
	.route("/get_suggestions")
	.get(
		validate(suggestionValidation.getSuggestions),
		validateToken,
		getSuggestions
	);

export default router;
