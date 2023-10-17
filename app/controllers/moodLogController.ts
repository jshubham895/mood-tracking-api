import { RequestHandler, Response } from "express";
import { MoodLog, User } from "../../db";
import moment from "moment";
import { Op } from "sequelize";
import sequelize from "sequelize";
import { DateTime } from "luxon";

export const logMood: RequestHandler = async (req, res) => {
	try {
		const {
			emoji,
			message = null,
			user: { userId }
		} = req.body;

		await MoodLog.create({
			UserId: userId,
			emoji,
			message
		});

		return res.status(200).json("Mood logged successfully.");
	} catch (err) {
		console.error("Error in logMood", err);
		if (err instanceof Error) {
			return res.status(400).json(err.message);
		}
		return res.status(400).json("Error while creating log entry.");
	}
};

export const getMonthlySummary: RequestHandler = async (req, res) => {
	try {
		const { month = null, year = null } = req.query;

		const {
			user: { userId }
		} = req.body;

		const queryMonth = month
			? parseInt(month.toString()) - 1
			: moment().month();

		const queryYear = year ? parseInt(year.toString()) : moment().year();

		const startDate = moment()
			.year(queryYear)
			.month(queryMonth)
			.startOf("month")
			.toISOString();

		const endDate = moment()
			.year(queryYear)
			.month(queryMonth)
			.endOf("month")
			.toISOString();

		const result = await MoodLog.findAll({
			attributes: [
				"emoji",
				[sequelize.fn("array_agg", sequelize.col("message")), "messages"],
				[sequelize.fn("COUNT", sequelize.col("message")), "message_count"]
			],
			where: {
				UserId: userId,
				createdAt: {
					[Op.between]: [startDate, endDate]
				}
			},
			group: ["emoji"],
			order: [
				[sequelize.literal("message_count"), "DESC"],
				[sequelize.literal('MAX("createdAt")'), "DESC"]
			]
		});

		return res.status(200).json(result);
	} catch (err) {
		console.error("Error in getMonthlySummary", err);
		if (err instanceof Error) {
			return res.status(400).json(err.message);
		}
		return res.status(400).json("Error in getting user mood log summary.");
	}
};

export const updateMoodLog: RequestHandler = async (req, res) => {
	try {
		const moodLogId = req.params.id;
		const { emoji = null, message = null } = req.body;

		const moodLog = await MoodLog.findByPk(moodLogId);
		if (!moodLog) {
			throw new Error("No MoodLog found.");
		}

		if (!emoji && !message) {
			throw new Error("Please provide data to update");
		}

		if (emoji) moodLog.emoji = emoji;
		if (message) moodLog.message = message;

		await moodLog.save();

		return res.status(200).json("MoodLog updated successfully.");
	} catch (err) {
		console.log("Error in updateMoodLog", err);
		if (err instanceof Error) {
			return res.status(400).json(err.message);
		}
		return res.status(400).json("Error while updating mood log.");
	}
};

export const deleteMoodLog: RequestHandler = async (req, res) => {
	try {
		const moodLogId = req.params.id;

		const moodLog = await MoodLog.findByPk(moodLogId);
		if (!moodLog) {
			throw new Error("No MoodLog found.");
		}

		await moodLog.destroy();

		return res.status(200).json("MoodLog deleted successfully.");
	} catch (err) {
		console.log("Error in deleteMoodLog", err);
		if (err instanceof Error) {
			return res.status(400).json(err.message);
		}
		return res.status(400).json("Error while deleting mood log.");
	}
};

export const filterMoodLogs: RequestHandler = async (req, res) => {
	try {
		const {
			user: { userId }
		} = req.body;
		const { chronological, from, to } = req.query;

		if (!chronological && !(from || to)) {
			throw new Error("Filter parameters are required.");
		}

		let moodLogs;
		if (chronological) {
			moodLogs = await MoodLog.findAll({
				where: {
					UserId: userId
				},
				order: [["createdAt", "ASC"]]
			});
		} else {
			const startDate = from
				? (DateTime.fromISO(
						moment(from.toString(), "DD-MM-YYYY").toISOString()
				  ).toISO() as string)
				: (new Date().toISOString() as string);
			const endDate = to
				? (DateTime.fromISO(
						moment(to.toString(), "DD-MM-YYYY").endOf("day").toISOString()
				  ).toISO() as string)
				: (DateTime.now().toISO() as string);

			if (moment(startDate).isAfter(moment(endDate).toISOString())) {
				throw new Error(
					"End date must be greater than or equal to start date."
				);
			}

			moodLogs = await MoodLog.findAll({
				where: {
					UserId: userId,
					createdAt: {
						[Op.between]: [startDate, endDate]
					}
				},
				order: [["createdAt", "ASC"]]
			});
		}

		return res.status(200).json(moodLogs);
	} catch (err) {
		console.log("Error in filterMoodLogs", err);
		if (err instanceof Error) {
			return res.status(400).json(err.message);
		}
		return res.status(400).json("Error while filtering mood logs.");
	}
};
