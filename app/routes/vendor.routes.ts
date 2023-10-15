import { Router } from "express";
import { addOrUpdateStock, getData } from "../controllers/vendorController";
const router = Router();
import { validate } from "express-validation";
import vendorValidation from "../validations/vendor.validation";

router.route("/").get(getData);

router
	.route("/update")
	.post(validate(vendorValidation.update), addOrUpdateStock);

export default router;
