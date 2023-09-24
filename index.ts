import express, { ErrorRequestHandler, Express } from "express";
import bodyParser from "body-parser";
const app: Express = express();
import appRoutes from "./app/routes/approutes";
import { ValidationError } from "express-validation";

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use("/api", appRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
	if (err instanceof ValidationError) {
		return res.status(err.statusCode).json(err);
	}
	return res.status(500).json(err);
};

app.use(errorHandler);
