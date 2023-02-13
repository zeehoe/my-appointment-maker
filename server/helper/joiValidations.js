const Joi = require("joi");
const malaysiaPhoneRegex = /^(01)[0-46-9]-*[0-9]{7,8}$/;

module.exports = {
    validationPhoneNumber : Joi.string()
    .pattern(malaysiaPhoneRegex, "Malaysia phone number")
    .messages({
      "string.empty": `Phone number cannot be empty`,
      "any.required": `Phone number is required`,
      "string.pattern.name": "Phone number need to be in Malaysia format",
    }),

    validationDatetime : Joi.string()
    .regex(
      /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/,
      "date format YYYY-MM-DD HH:mm:ss"
    )
    .messages({
      "string.empty": `Appointment time cannot be empty`,
      "any.required": `Appointment time is required`,
      "string.pattern.base": "Appointment time format not match",
      "string.pattern.name": "Appointment time format not match",
    }),

    validationEmail: Joi.string().email({ minDomainSegments: 2 }).messages({
      "string.email": `Email not valid`,
      "string.empty": `Email cannot be empty`,
      "any.required": `Email is required`,
    }),

    validationNotes: Joi.string().max(200)
}