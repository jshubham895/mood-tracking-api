import validation from "./common.validation";
import Joi from "joi";

export default {
	create: {
		body: Joi.object({
			emoji: validation.stringRequired,
			message: validation.stringOptional
		})
	},
	summary: {
		query: Joi.object({
			month: validation.numberOptional,
			year: validation.numberOptional
		})
	},
	update: {
		body: Joi.object({
			emoji: validation.stringOptional,
			message: validation.stringOptional
		}),
		params: Joi.object({
			id: validation.uuidRequired
		})
	},
	delete: {
		params: Joi.object({
			id: validation.uuidRequired
		})
	},
	filter: {
		query: Joi.object({
			chronological: validation.booleanOptional,
			from: validation.stringOptional,
			to: validation.stringOptional
		})
	}
};
