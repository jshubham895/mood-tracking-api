import { sign, verify } from "jsonwebtoken";
import { RequestHandler } from "express";
import dotenv from "dotenv";
import { UserInstance } from "./models/User.model";
dotenv.config();

export const createToken = (user: UserInstance) => {
	const secretKey = process.env.JWT_SECRET_KEY ?? "superSecretKey";
	const accessToken = sign({ email: user.email, id: user.id }, secretKey, {
		expiresIn: 15 * 60
	});

	return accessToken;
};
