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

module.exports = {
  checkAppointmentTime,
};
