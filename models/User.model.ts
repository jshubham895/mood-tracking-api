import { DataTypes } from "sequelize";
import sequelize from "../db";
import { UUIDV4 } from "sequelize";

const User = sequelize.define("User", {
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

console.log("User model", User === sequelize.models.User); // true
console.log("User model", sequelize.define); // true

export default User;
