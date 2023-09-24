import validation from "./common.validation";
import Joi from "joi";

export default {
	userRequest: {
		body: Joi.object({
			items: validation.arrayRequired.items(
				Joi.object({
					id: validation.stringRequired,
					stock: validation.arrayRequired.items(
						Joi.object({
							size: Joi.string().valid("S", "M", "L", "XL"),
							quantity: validation.positiveIntegerRequired
						})
					)
				})
			)
		})
	}
};
