import validation from "./common.validation";
import Joi from "joi";

export default {
	update: {
		body: Joi.object({
			updateData: validation.arrayRequired.items(
				Joi.object({
					id: validation.stringRequired,
					stock: validation.arrayRequired.items(
						Joi.object({
							size: Joi.string().valid("S", "M", "L", "XL"),
							price: validation.positiveNumberOptional,
							quantity: validation.positiveIntegerRequired
						})
					)
				})
			)
		})
	}
};
