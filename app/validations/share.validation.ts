import validation from "./common.validation";
import Joi from "joi";

export default {
	viewData: {
		params: Joi.object({
			id: validation.uuidRequired
		})
	}
};
