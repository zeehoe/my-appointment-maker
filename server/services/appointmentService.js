const moment = require("moment");
const { BasicError } = require("../helper/errors");
const { checkAppointmentTime } = require("../helper/time");
const Appointment = require("../model/appointmentModel");

module.exports = {
  create: async (dateTime, phoneNumber, email, notes) => {
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
    return appointment;
  },

  reschedule: async (dateTime, phoneNumber) => {
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
    return appointment;
  },

  cancel: async (phoneNumber) => {
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
    return appointment;
  },

  all: async (type, phoneNumber) => {
    let appointments = null;

    if (!type || type.toUpperCase() == "ALL") {
      appointments = await Appointment.find({
        phoneNumber: phoneNumber,
      });
    } else if (type.toUpperCase() == "ACTIVE") {
      const now = moment().format("YYYY-MM-DD HH:mm:ss");
      appointments = await Appointment.find({
        phoneNumber: phoneNumber,
        status: "P",
        dateTime: { $gt: now },
      });
    } else if (type.toUpperCase() == "COMPLETED") {
      appointments = await Appointment.find({
        phoneNumber: phoneNumber,
        status: "Y",
      });
    }
    return appointments;
  },
};
