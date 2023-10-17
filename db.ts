import { DataTypes, Sequelize } from "sequelize";
import { initUserModel } from "./app/models/User.model";
import { initMoodLogModel } from "./app/models/MoodLog.model";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize({
	host: process.env.DB_HOST as string,
	database: process.env.DB_DATABASE as string,
	username: process.env.DB_USERNAME as string,
	password: process.env.DB_PASSWORD as string,
	port: process.env.DB_PORT as undefined,
	dialect: "postgres"
});

export const User = initUserModel(sequelize);
export const MoodLog = initMoodLogModel(sequelize);

User.hasMany(MoodLog, {
	foreignKey: {
		allowNull: false
	}
});
MoodLog.belongsTo(User);

export default sequelize;
