import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";

interface MoodLogAttibutes {
	UserId?: string;
	id?: string;
	emoji: string;
	message?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface MoodLogInstance
	extends Model<MoodLogAttibutes>,
		MoodLogAttibutes {
	messages: string[];
}

export const initMoodLogModel = (sequelize: Sequelize) => {
	return sequelize.define<MoodLogInstance>("MoodLog", {
		id: {
			type: DataTypes.UUID,
			defaultValue: UUIDV4,
			primaryKey: true
		},
		emoji: {
			type: DataTypes.STRING,
			allowNull: false
		},
		message: {
			type: DataTypes.STRING,
			allowNull: true
		}
	});
};
