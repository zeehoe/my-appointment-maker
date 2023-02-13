const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      min: 9,
      max: 11,
    },
    dateTime: { type: Date, required: true },
    email: {
      type: String,
    },
    status: {
      type: String,
      default: "P",
    },
    notes: { type: String, max: 200 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Appointments", appointmentSchema);
