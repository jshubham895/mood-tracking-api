import { Router } from "express";
import { validate } from "express-validation";
import { loginUser, signUp } from "../controllers/userController";
import userValidation from "../validations/user.validation";
import validateToken from "../middlewares/authMiddleware";

const router = Router();

router.route("/login").post(validate(userValidation.login), loginUser);

router.route("/signup").post(validate(userValidation.signup), signUp);

export default router;
