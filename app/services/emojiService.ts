import fs from "fs";

class EmojiService {
	private emojiData: { [key: string]: string[] } = {}; // In-memory emoji data

	loadEmojisFromFile(filename: string): void {
		const rawData = fs.readFileSync(filename, "utf-8");
		this.emojiData = JSON.parse(rawData);
	}

	findKeywordsByEmoji(emoji: string): string[] | undefined {
		return this.emojiData[emoji];
	}

	findEmojisByKeyword(keyword: string): string[] {
		const emojis: string[] = [];
		for (const [emoji, keywords] of Object.entries(this.emojiData)) {
			if (keywords.includes(keyword)) {
				emojis.push(emoji);
			}
		}
		return emojis;
	}
}

export default EmojiService;
