import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import { createToken } from "../JWT";
import { User } from "../../db";
import { UserInstance } from "../models/User.model";
import dotenv from "dotenv";
dotenv.config();

const encryptPassword = async (password: string) => {
	const hash = await bcrypt.hash(password, 10);
	return hash.toString();
};

const decryptPassword = async (passwordHash: string, password: string) => {
	const result = await bcrypt.compare(password, passwordHash);
	return result;
};

export const signUp: RequestHandler = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const passwordHash = await encryptPassword(password);
		await User.create({
			name,
			email,
			password: passwordHash
		});
		return res.status(200).json("User created successfully.");
	} catch (err) {
		console.error("Error in signUp", err);
		if (err instanceof Error) {
			return res.status(400).json(err.message);
		}
		return res.status(400).json("Error while creating user.");
	}
};

export const loginUser: RequestHandler = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user: UserInstance | null = await User.findOne({
			where: { email: email }
		});

		if (!user) {
			return res.status(500).json({ success: false, msg: "User not found." });
		}

		const passwordMatch = await decryptPassword(user.password, password);
		if (!passwordMatch) {
			return res
				.status(500)
				.json({ success: false, msg: "Incorrect email or password" });
		}

		const accessToken = createToken(user);

		return res.status(200).json({ success: true, access_token: accessToken });
	} catch (err) {
		console.error("Error in loginUser", err);
		if (err instanceof Error) {
			return res.status(400).json(err.message);
		}
		return res.status(400).json("Error while signing in user.");
	}
};
