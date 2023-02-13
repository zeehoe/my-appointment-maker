import { useState } from "react";
import logo from "./assets/logo.png";
import "./css/App.scss";
import DropdownDatetimePicker from "./components/DropdownDatetimePicker";
import MyLabel from "./components/MyLabel";
import styled from "styled-components";
import MyEmailInput from "./components/MyEmailInput";
import MyPhoneInput from "./components/MyPhoneInput";
import MyButton from "./components/MyButton";
import MyReminderBoard from "./components/MyReminderBoard";
import { API_BASE_URL, API_KEY } from "./config";
import Swal from "sweetalert2";
import axios from "axios";

function App() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [historyAppointments, setHistoryAppointments] = useState([]);
  const apiRequestHeaders = {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
  };

  const alertOn = (value, toFill) => {
    if (!value) {
      Swal.fire({
        title: "Error!",
        text: `${toFill} must be filled`,
        icon: "error",
        confirmButtonText: "OK",
      });
      return false;
    }
    return true;
  };

  const submitAppointment = () => {
    if (
      alertOn(email, "Email") &&
      alertOn(phoneNumber, "Phone") &&
      alertOn(dateTime, "Appointment Date")
    ) {
      axios
        .post(
          `${API_BASE_URL}/appointment/create`,
          {
            phoneNumber,
            email,
            dateTime,
          },
          { headers: apiRequestHeaders }
        )
        .then((response) => {
          // handle successful response
          setHistoryAppointments([response.data.appointment])
          Swal.fire({
            title: "Success!",
            text: response.data.message,
            icon: "success",
            confirmButtonText: "OK",
          });
        })
        .catch((error) => {
          // handle error
          if (error.response && error.response.data) {
            Swal.fire({
              title: "Error!",
              text: error.response.data.message,
              icon: "error",
              confirmButtonText: "OK",
            });
          }
          checkAppointment()
        });
    }
  };

  const checkAppointment = () => {
    if (alertOn(phoneNumber, "Phone Number")) {
      axios
        .get(`${API_BASE_URL}/appointment/list/${phoneNumber}`, {
          headers: apiRequestHeaders,
          params: {
            type: "Active",
          },
        })
        .then((response) => {
          // handle successful response
          console.log(response);
          setHistoryAppointments(response.data);
        })
        .catch((error) => {
          // handle error
          if (error.response && error.response.data) {
            Swal.fire({
              title: "Error!",
              text: error.response.data.message,
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        });
    }
  };

  const cancelAppointment = (phoneNumber) => {
    if (!phoneNumber || phoneNumber == ''){
      return 
    }
    axios
      .post(
        `${API_BASE_URL}/appointment/cancel`,
        {
          phoneNumber,
        },
        {
          headers: apiRequestHeaders,
        }
      )
      .then((response) => {
        // handle successful response
        Swal.fire({
          title: "Success!",
          text: response.data.message,
          icon: "success",
          confirmButtonText: "OK",
        });
        setHistoryAppointments([]);
      })
      .catch((error) => {
        // handle error
        if (error.response && error.response.data) {
          Swal.fire({
            title: "Error!",
            text: error.response.data.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      });
  };

  return (
    <div className="App my-form">
      <div className="img-container">
        <img className="App-logo" src={logo} />
      </div>

      <FormItem>
        <MyLabel text="Phone Number" />
        <MyPhoneInput onChange={setPhoneNumber} />
      </FormItem>

      <FormItem>
        <MyLabel text="Email" />
        <MyEmailInput onChange={setEmail} />
      </FormItem>

      <FormItem>
        <MyLabel text="Appointment Time" />
        <DropdownDatetimePicker onChange={setDateTime} />
      </FormItem>

      <FormItem style={{ flex: 1 }}>
        <MyLabel text="Reminder Board" />
        <MyReminderBoard
          data={historyAppointments.length > 0 ? historyAppointments[0] : null}
          onCancelClick={cancelAppointment}
        />
      </FormItem>

      <FormItem>
        <FormRow>
          <MyButton
            text="Submit Appointment"
            backgroundColor="#4CAF50"
            onClick={submitAppointment}
          />
          <MyButton
            text="Check Appointment"
            backgroundColor="#008CBA"
            onClick={checkAppointment}
          />
        </FormRow>
      </FormItem>
    </div>
  );
}

const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.2rem;
  width: 100%;
  align-items: center;
  margin-bottom: 20px;
  max-width: 350px;
  position: relative;
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

export default App;
