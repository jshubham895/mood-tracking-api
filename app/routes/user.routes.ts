import { Router } from "express";
import { validate } from "express-validation";
import {
	checkProductAvailability,
	getLowestPrice
} from "../controllers/userController";
const router = Router();
import userValidation from "../validations/user.validation";

router
	.route("/check_availability")
	.get(validate(userValidation.userRequest), checkProductAvailability);

router
	.route("/get_lowest_price")
	.get(validate(userValidation.userRequest), getLowestPrice);

export default router;
