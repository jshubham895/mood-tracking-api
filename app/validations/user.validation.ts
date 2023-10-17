import validation from "./common.validation";
import Joi from "joi";

export default {
	signup: {
		body: Joi.object({
			name: validation.stringRequired,
			email: validation.emailRequired,
			password: validation.stringRequired
		})
	},
	login: {
		body: Joi.object({
			email: validation.emailRequired,
			password: validation.stringRequired
		})
	}
};
