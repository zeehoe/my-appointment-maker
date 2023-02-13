const Appointment = require("../model/appointmentModel");
const moment = require("moment");
const Joi = require("joi");
const { BasicError } = require("../helper/errors");
const {
  validationPhoneNumber,
  validationDatetime,
  validationEmail,
  validationNotes,
} = require("../helper/joiValidations");

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

    // check valid rules for timeslot
    const appointmentTimeErrorMessage = checkAppointmentTime(dateTime);
    if (appointmentTimeErrorMessage) {
      throw new BasicError(appointmentTimeErrorMessage);
    }

    // check timeslot if booked by others
    const existingAppointment = await Appointment.findOne({
      dateTime,
      status: "P",
    });
    if (existingAppointment) {
      if (existingAppointment.phoneNumber == phoneNumber) {
        throw new BasicError("You have already book this time slot");
      }
      throw new BasicError("Time slot has already booked");
    }

    // check any pending appointment on the requester
    const now = moment().format("YYYY-MM-DD HH:mm:ss");
    const existingSelfAppointment = await Appointment.findOne({
      phoneNumber,
      status: "P",
      dateTime: { $gt: now },
    });
    if (existingSelfAppointment) {
      throw new BasicError(
        `You have already made an appointment at ${existingSelfAppointment.dateTime}. Please be there on time.`
      );
    }

    // create appointment
    const appointment = await Appointment.create({
      phoneNumber,
      email,
      dateTime,
      notes,
    });
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
    const errorMessage = checkAppointmentTime(dateTime);
    if (errorMessage) {
      throw new BasicError(errorMessage);
    }

    //3- Find and update the appointment with the specified phoneNumber
    const appointment = await Appointment.findOneAndUpdate(
      { phoneNumber, status: "P" },
      { $set: { dateTime } },
      { returnOriginal: false }
    );
    if (!appointment) {
      throw new BasicError("No appointment found");
    }
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

    //2- Find and update the appointment with the specified phoneNumber
    const now = moment().format("YYYY-MM-DD HH:mm:ss");
    const appointment = await Appointment.findOneAndUpdate(
      { phoneNumber, status: "P", dateTime: { $gt: now } },
      { $set: { status: "N" } },
      { returnOriginal: false }
    );
    if (!appointment) {
      throw new BasicError("No appointment found");
    }
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
    let appointments = null;

    if (!type || type.toUpperCase() == "ALL") {
      appointments = await Appointment.find({
        phoneNumber: req.params.phoneNumber,
      });
    } else if (type.toUpperCase() == "ACTIVE") {
      const now = moment().format("YYYY-MM-DD HH:mm:ss");
      appointments = await Appointment.find({
        phoneNumber: req.params.phoneNumber,
        status: "P",
        dateTime: { $gt: now },
      });
    } else if (type.toUpperCase() == "COMPLETED") {
      appointments = await Appointment.find({
        phoneNumber: req.params.phoneNumber,
        status: "Y",
      });
    }

    return res.json(appointments);
  } catch (ex) {
    next(ex);
  }
};

const checkAppointmentTime = (datetimeString) => {
  const datetime = new Date(datetimeString);

  // Rule 1: must be future time slot
  const now = new Date();
  const isFutureTimeSlot = datetime.getTime() > now.getTime();
  if (!isFutureTimeSlot) {
    return "Cannot set appointment on previous time";
  }

  // Rule 2: must be within Monday to Friday
  const isWeekday = datetime.getDay() >= 1 && datetime.getDay() <= 5;
  if (!isWeekday) {
    return "Appointment time must be at weekday";
  }

  // Rule 3: 9am to 5pm only
  const isOperationHour = datetime.getHours() >= 9 && datetime.getHours() <= 17;
  if (!isOperationHour) {
    return "Appointment time out of operation hour";
  }

  // Rule 4: must be at least 2 days later from today
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 2);
  const isAtleast2DaysBefore = datetime >= minDate;
  if (!isAtleast2DaysBefore) {
    return "Appointment time need to be at least 2 days from now";
  }

  // Rule 5: cannot be more than 3 weeks
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 21);
  const isWithin3Weeks = datetime <= maxDate;
  if (!isWithin3Weeks) {
    return "Appointment time need to be within 3 weeks";
  }
  return "";
};
