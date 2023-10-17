import { RequestHandler } from "express";
import { MoodLog, User } from "../../db";

export const getShareableLink: RequestHandler = async (req, res) => {
	try {
		const {
			user: { userId }
		} = req.body;

		const user = await User.findByPk(userId);

		if (user) {
			const { isShareable = false } = user;

			if (!isShareable) {
				user.isShareable = true;
				await user.save();
			}

			const link = `${process.env.SHAREABLE_LINK_HOST}/api/share/user/${userId}`;

			return res.status(200).json({ link });
		}

		throw new Error("User not found.");
	} catch (err) {
		console.error("Error in getShareableLink", err);
		if (err instanceof Error) {
			return res.status(400).json(err.message);
		}
		return res.status(400).json("Error while generating shareable link.");
	}
};

export const disableShareableLink: RequestHandler = async (req, res) => {
	try {
		const {
			user: { userId }
		} = req.body;

		const user = await User.findByPk(userId);

		if (user) {
			user.isShareable = false;
			await user.save();

			return res.status(200).json("Sharing link disabled successfully.");
		}

		throw new Error("User not found.");
	} catch (err) {
		console.error("Error in disableShareableLink", err);
		if (err instanceof Error) {
			return res.status(400).json(err.message);
		}
		return res.status(400).json("Error while disabling shareable link.");
	}
};

export const viewUserMoodLogs: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;

		const user = await User.findByPk(id);

		if (!user) {
			return res.status(400).json("No user found.");
		}
		if (!user.isShareable) {
			return res.status(403).json("Sharing is disabled by the user.");
		}

		const userMessages = await MoodLog.findAll({
			attributes: {
				exclude: ["updatedAt", "UserId", "id"]
			},
			where: {
				UserId: id
			},
			order: [["createdAt", "DESC"]]
		});

		return res.status(200).json(userMessages);
	} catch (err) {
		console.error("Error in viewUserMoodLogs", err);
		if (err instanceof Error) {
			return res.status(400).json(err.message);
		}
		return res.status(400).json("Error while fetching user messages.");
	}
};
