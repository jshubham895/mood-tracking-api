import { DataTypes, Sequelize } from "sequelize";
// import User from "./models/User";
import { UUIDV4 } from "sequelize";

const sequelize = new Sequelize({
	host: "db.tvhwesawjyluqpcukdmy.supabase.co",
	database: "postgres",
	username: "postgres",
	password: "J_?YN#fX8T52$bK",
	dialect: "postgres"
});

sequelize.define("User", {
	id: {
		type: DataTypes.UUID,
		defaultValue: UUIDV4,
		primaryKey: true
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false
	},
	isSharable: {
		type: DataTypes.BOOLEAN,
		defaultValue: false
	}
});

export default sequelize;
