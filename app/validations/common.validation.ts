import Joi from "joi";

export default {
	objectRequired: Joi.object().required(),
	objectOptional: Joi.object().optional(),
	stringRequired: Joi.string().required(),
	stringOptional: Joi.string().allow("", null).empty("").optional(),
	numberRequired: Joi.number().required(),
	numberOptional: Joi.number().allow(null).optional(),
	arrayRequired: Joi.array().required(),
	arrayOptional: Joi.array().optional(),
	positiveNumberRequired: Joi.number().positive().required(),
	positiveNumberOptional: Joi.number().positive().optional(),
	positiveIntegerOptional: Joi.number().integer().optional(),
	positiveIntegerRequired: Joi.number().integer().optional()
};
