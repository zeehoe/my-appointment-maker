const Appointment = require("../model/appointmentModel");
const Joi = require("joi");
const { BasicError } = require("../helper/errors");
const {
  validationPhoneNumber,
  validationDatetime,
  validationEmail,
  validationNotes,
} = require("../helper/joiValidations");
const {
  create,
  reschedule,
  cancel,
  all,
} = require("../services/appointmentService");

module.exports.create = async (req, res, next) => {
  try {
    // 1- doing validation
    const schema = Joi.object({
      dateTime: validationDatetime.required(),
      phoneNumber: validationPhoneNumber.required(),
      email: validationEmail.required(),
      notes: validationNotes,
    });
    const { error } = schema.validate(req.body);
    if (error) {
      throw new BasicError(error);
    }
    const { dateTime, phoneNumber, email, notes } = req.body;
    const appointment = await create(dateTime, phoneNumber, email, notes);

    return res.json({
      message: `Appointment booked at ${dateTime}`,
      status: true,
      appointment,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.reschedule = async (req, res, next) => {
  try {
    // 1- doing validation
    const schema = Joi.object({
      phoneNumber: validationPhoneNumber.required(),
      dateTime: validationDatetime.required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      throw new BasicError(error);
    }

    const { phoneNumber, dateTime } = req.body;

    //2- check date time follow rules
    const appointment = await reschedule(dateTime, phoneNumber);
    return res.json({
      message: "Appointment rescheduled successfully.",
      status: true,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.cancel = async (req, res, next) => {
  try {
    // 1- doing validation
    const schema = Joi.object({
      phoneNumber: validationPhoneNumber.required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      throw new BasicError(error);
    }

    const { phoneNumber } = req.body;
    const appointment = await cancel(phoneNumber);

    return res.json({
      message: "Appointment cancelled successfully.",
      status: true,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.list = async (req, res, next) => {
  try {
    let type = req.query.type;
    let phoneNumber = req.params.phoneNumber;
    return res.json(await all(type, phoneNumber));
  } catch (ex) {
    next(ex);
  }
};
