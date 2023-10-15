import { ErrorRequestHandler } from "express";
import { ValidationError } from "express-validation";

const validationErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
	if (err instanceof ValidationError) {
		return res.status(err.statusCode).json(err);
	}
	return res.status(500).json(err);
};

export default validationErrorHandler;
