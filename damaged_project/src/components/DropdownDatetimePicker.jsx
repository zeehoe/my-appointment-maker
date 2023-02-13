import React, { useEffect, useState } from "react";
import "./../css/DropdownTimepicker.scss";

const DropdownDateTimePicker = ({
  onChange,
  operatingHour = { start: 9, end: 18 },
  excludeWeekend = true,
}) => {
  const [date, setDate] = useState("");
  const [hours, setHours] = useState("");
  const [warning, setWarning] = useState("");
  const [isValid, setValid] = useState(true);

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const inputCheck = () => {
    if (!date || !hours) {
      return;
    }
    const day = new Date(`${date} ${hours}:00`).getDay();
    if (
      hours < operatingHour.start ||
      hours > operatingHour.end ||
      (excludeWeekend && (day === 0 || day === 6))
    ) {
      setValid(false)
      let warningText = "Time slot not available. Weekday only.";
      // warningText += ` ${get12HourTimeFormat(
      //   operatingHour.start
      // )} till ${get12HourTimeFormat(operatingHour.end)}`;

      setWarning(warningText);
    } else {
      setWarning("");
      setValid(true)
      if (onChange) onChange(`${date} ${hours}:00:00`);
    }
  };

  useEffect(() => {
    inputCheck();
  }, [hours, date]);

  const handleTimeChange = (event) => {
    setHours(event.target.value);
  };

  const get12HourTimeFormat = (hourValue) => {
    let ampm = "AM";
    let toConvertHour = hourValue;
    if (toConvertHour >= 12) {
      ampm = "PM";
      toConvertHour = toConvertHour === 12 ? 12 : toConvertHour - 12;
    }
    const displayHourValue = `${toConvertHour}:00 ${ampm}`;
    return displayHourValue;
  };

  return (
    <>
      <div className="dropdown-date-time-picker">
        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          style={{ borderColor: isValid ? "" : "red" }}
        />
        <select value={hours} onChange={handleTimeChange}>
          <option value="">Select a time</option>
          {[...Array(operatingHour.end - operatingHour.start)].map(
            (_, hour) => {
              hour += 9;
              let ampm = "AM";
              const hourValue = `${hour}:00`;
              return (
                <option key={hourValue} value={hour>9?hour:`0${hour}`}>
                  {get12HourTimeFormat(hour)}
                </option>
              );
            }
          )}
        </select>
      </div>
      {warning && <div className="warning">* {warning}</div>}
    </>
  );
};

export default DropdownDateTimePicker;
