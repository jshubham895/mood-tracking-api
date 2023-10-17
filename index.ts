import express from "express";
import bodyParser from "body-parser";
import {
	closeDatabaseConnection,
	syncDatabase
} from "./app/services/dbService";
import appRoutes from "./app/routes/approutes";
import dotenv from "dotenv";
import validationErrorHandler from "./app/middlewares/expressValidation";
import EmojiService from "./app/services/emojiService";
dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use("/api", appRoutes);

app.use(validationErrorHandler);

app.listen(3000, async () => {
	await syncDatabase();
	console.log("Server started successfully.");
});

const exitHandler = async (
	options: { cleanup?: boolean; exit?: boolean },
	exitCode: null | number
) => {
	await closeDatabaseConnection();
	if (options.cleanup) console.log("clean");
	if (exitCode || exitCode === 0) console.log(exitCode);
	if (options.exit) process.exit();
};

//do something when app is closing
process.on("exit", exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
