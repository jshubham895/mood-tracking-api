import { RequestHandler } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../../db";
dotenv.config();

const validateToken: RequestHandler = async (req, res, next) => {
	const jwtSecretKey = process.env.JWT_SECRET_KEY ?? "superSecretKey";
	const accessToken = req.headers.authorization?.toString().slice(7);

	if (!accessToken)
		return res.status(400).json({ error: "Access Token Missing" });

	try {
		const decodedToken: JwtPayload | string = verify(accessToken, jwtSecretKey);

		if (typeof decodedToken === "object") {
			const user = await User.findOne({
				where: {
					email: decodedToken.email
				}
			});

			if (!user || user.id !== decodedToken.id) {
				res.status(404).json("User not found");
			}

			req.body.user = {
				email: decodedToken.email,
				userId: decodedToken.id
			};

			next();
		} else {
			res.status(404).json("User not found");
		}
	} catch (error) {
		next(error);
	}
};

export default validateToken;
