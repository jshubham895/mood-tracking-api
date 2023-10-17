import { UUIDV4 } from "sequelize";
import { DataTypes, Model, Sequelize } from "sequelize";
import { MoodLogInstance } from "./MoodLog.model";

interface UserAttributes {
	id?: string;
	name: string;
	email: string;
	password: string;
	isShareable?: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface UserInstance extends Model<UserAttributes>, UserAttributes {}

export const initUserModel = (sequelize: Sequelize) => {
	const User = sequelize.define<UserInstance>("User", {
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
			allowNull: false,
			unique: true
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		isShareable: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		}
	});
	return User;
};
