import { RequestHandler } from "express";
import EmojiService from "../services/emojiService";
import path from "path";

export const getSuggestions: RequestHandler = async (req, res) => {
	try {
		const emojiPath = path.join(__dirname, "..", "..", "emojis.json");

		const emojis = new EmojiService();
		emojis.loadEmojisFromFile(emojiPath);

		const { message } = req.body;

		const strArray = message.split(" ");

		let resArray: any = [];

		for (let i = 0; i < strArray.length; i++) {
			const matchingEmojis = emojis.findEmojisByKeyword(strArray[i]);
			resArray = resArray.concat(matchingEmojis);
		}

		return res.status(200).json(resArray);
	} catch (err) {
		console.error("Error in getSuggestions", err);
		if (err instanceof Error) {
			return res.status(400).json(err.message);
		}
		return res.status(400).json("Error while fetch emoji suggestions.");
	}
};
