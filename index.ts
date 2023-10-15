import express from "express";
import bodyParser from "body-parser";
import { closeDatabaseConnection, syncDatabase } from "./dbService";
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

(async () => await syncDatabase())();

app.listen(3000, () => {
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
