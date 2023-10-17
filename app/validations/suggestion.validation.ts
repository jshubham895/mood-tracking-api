import validation from "./common.validation";
import Joi from "joi";

export default {
	getSuggestions: {
		body: Joi.object({
			message: validation.stringRequired
		})
	}
};
