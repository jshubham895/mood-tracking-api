import { Request } from "express";

export type UserType = {
	id: string;
	name: string;
	password: string;
	email: string;
	isShareable: boolean;
};

export interface AuthRequest extends Request {
	user?: {
		email?: string | null;
		userId?: string | null;
	};
}
