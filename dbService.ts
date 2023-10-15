import sequelize from "./db";

export const getConnection = async () => {
	try {
		await sequelize.authenticate();
		console.log("Database connection established successfully.");
	} catch (error) {
		console.log("Error while authenticating database.", error);
	}
};

export const syncDatabase = async () => {
	try {
		await getConnection();
		await sequelize.sync({ alter: true });
		console.log("Synchronized with database successfully.");
	} catch (error) {
		console.log("Error while syncing database ", error);
	}
};

export const closeDatabaseConnection = async () => {
	try {
		await sequelize.close();
		console.log("Database connection closed.");
	} catch (error) {
		console.error("Error while closing database connection:", error);
	}
};
