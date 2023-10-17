import { Router } from "express";
import validateToken from "../middlewares/authMiddleware";
import {
	disableShareableLink,
	getShareableLink,
	viewUserMoodLogs
} from "../controllers/shareController";
import shareValidation from "../validations/share.validation";
import { validate } from "express-validation";

const router = Router();

router.route("/get_shareable_link").get(validateToken, getShareableLink);

router
	.route("/disable_shareable_link")
	.post(validateToken, disableShareableLink);

router
	.route("/user/:id")
	.get(validate(shareValidation.viewData), viewUserMoodLogs);

export default router;
