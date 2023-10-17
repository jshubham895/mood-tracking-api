import { RequestHandler } from "express";
import sequelize, { MoodLog, User } from "../../db";
import Sentiment from "sentiment";
import { MoodLogInstance } from "../models/MoodLog.model";
import { faker } from "@faker-js/faker";

export const getInsights: RequestHandler = async (req, res) => {
	try {
		const {
			user: { userId }
		} = req.body;

		const user = await User.findByPk(userId);
		const frequentlyUsedEmojis = await getFrequentlyUsedEmojisWithSentiments(
			userId
		);
		const userInsights = getInsightsHelper(frequentlyUsedEmojis);

		const result = JSON.parse(JSON.stringify(user));
		result.insights = userInsights;

		return res.status(200).json({ result });
	} catch (err) {
		console.error("Error in getSuggestions", err);
		if (err instanceof Error) {
			return res.status(400).json(err.message);
		}
		return res.status(400).json("Error while fetching user insights.");
	}
};

export const getMoodBoardData: RequestHandler = async (req, res) => {
	try {
		const users = await User.findAll({ attributes: ["id"] });

		let resultArray = [];

		let overallHappyUsers = 0;
		let overallSadUsers = 0;
		let overallNeutralUsers = 0;

		let frequentPositiveWords: string[] = [];
		let frequentNegativeWords: string[] = [];

		for (const { id } of users) {
			if (id) {
				const frequentlyUsedEmojis =
					await getFrequentlyUsedEmojisWithSentiments(id);
				const userInsights: any = getInsightsHelper(frequentlyUsedEmojis);

				const fakeName = generateRandomName();
				const individualUserInsights = {
					user: {
						name: fakeName,
						email: generateRandomEmail(fakeName)
					},
					insights: userInsights
				};

				resultArray.push(individualUserInsights);

				if (userInsights.stats.overallMood === "positive") {
					overallHappyUsers++;
				} else if (userInsights.stats.overallMood === "negative") {
					overallSadUsers++;
				} else {
					overallNeutralUsers++;
				}

				frequentNegativeWords = frequentNegativeWords.concat(
					userInsights.stats.negativeWords
				);
				frequentPositiveWords = frequentPositiveWords.concat(
					userInsights.stats.positiveWords
				);
			}
		}

		const overallInsights = {
			frequentNegativeWords: mostRepeatedWords(frequentNegativeWords),
			frequentPositiveWords: mostRepeatedWords(frequentPositiveWords),
			overallHappyUsers: (overallHappyUsers / users.length) * 100,
			overallSadUsers: (overallSadUsers / users.length) * 100,
			overallNeutralUsers: (overallNeutralUsers / users.length) * 100
		};

		return res
			.status(200)
			.json({ usersInsights: resultArray, overallInsights });
	} catch (err) {
		console.error("Error in getMoodBoardData", err);
		if (err instanceof Error) {
			return res.status(400).json(err.message);
		}
		return res.status(400).json("Error while fetching board insights.");
	}
};

const getFrequentlyUsedEmojisWithSentiments = async (userId: string) => {
	let result = await MoodLog.findAll({
		attributes: [
			"emoji",
			[sequelize.fn("array_agg", sequelize.col("message")), "messages"],
			[sequelize.fn("COUNT", sequelize.col("message")), "message_count"]
		],
		where: {
			UserId: userId
		},
		group: ["emoji"],
		order: [[sequelize.literal("message_count"), "DESC"]],
		limit: 10
	});

	result = JSON.parse(JSON.stringify(result));

	return result;
};

const getInsightsHelper = (result: MoodLogInstance[]) => {
	if (result.length > 0) {
		let score = 0;
		let positiveWords: string[] = [];
		let negativeWords: string[] = [];
		let messageCount = 0;

		const sentiment = new Sentiment();

		for (let i = 0; i < result.length; i++) {
			const emojiScore = sentiment.analyze(result[i].emoji);
			score += emojiScore.comparative;
			const messages = result[i].messages;
			messageCount += messages.length;
			for (let j = 0; j < messages.length; j++) {
				const sentimentData = sentiment.analyze(messages[j]);
				score += sentimentData.comparative;
				positiveWords = positiveWords.concat(sentimentData.positive);
				negativeWords = negativeWords.concat(sentimentData.negative);
			}
		}

		const averageComparativeScore = score / (messageCount + result.length);

		const overallInsight = {
			moodPercentage: Math.abs(averageComparativeScore) * 100,
			overallMood:
				averageComparativeScore > 0
					? "positive"
					: averageComparativeScore < 0
					? "negative"
					: "neutral",
			positiveWords,
			negativeWords
		};

		return { frequentEmojis: result, stats: overallInsight };
	}

	return result;
};

const mostRepeatedWords = (arr: string[]) => {
	const wordCounts: { [word: string]: number } = {};

	arr.forEach((word) => {
		if (wordCounts[word]) {
			wordCounts[word]++;
		} else {
			wordCounts[word] = 1;
		}
	});

	const sortWordsWithOccurence = Object.keys(wordCounts).sort(
		(a, b) => wordCounts[b] - wordCounts[a]
	);

	return sortWordsWithOccurence.slice(0, 5);
};

function generateRandomName(): string {
	return faker.person.fullName();
}

function generateRandomEmail(name: string): string {
	return `${name
		.replace(" ", ".")
		.toLowerCase()}@${faker.internet.domainName()}`;
}
