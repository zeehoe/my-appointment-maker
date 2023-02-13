import React, { useState } from "react";
import styled from "styled-components";
import Swal from "sweetalert2";

const MyReminderBoard = ({ data, onCancelClick }) => {
  const styles = {
    fontSize: "1em",
    textAlign: "center",
    display: "flex",
    width: "100%",
    borderColor: "blue",
    flex: "1",
    borderColor: "#2196F3",
    backgroundColor: "#ddffff",
    borderLeft: "6px solid #2196F3",
    padding: "20px 0px",
    position: "relative",
  };

  const handleCancel = () => {
    if (!data) {
      return;
    }
    Swal.fire({
      title: "Are you sure you want to cancel this appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        if (onCancelClick) {
          onCancelClick(data ? data.phoneNumber : "");
        }
      }
    });
  };

  return (
    <div style={styles}>
      {data ? (
        <>
          <CancelButton onClick={() => handleCancel()}>X</CancelButton>
          <ReminderItem
            dangerouslySetInnerHTML={{
              __html: data && formatDate(data.dateTime),
            }}
          />
        </>
      ) : (
        <ReminderItem style={{ fontWeight: "normal" }}>
          No appointment. Please click "Check Appointment" to refresh
        </ReminderItem>
      )}
    </div>
  );
};

const formatDate = (dateTime) => {
  const date = new Date(dateTime);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour12: true,
  };
  return (
    date.toLocaleDateString("en-US", options) +
    "<br>" +
    date.toLocaleTimeString([], { hour12: true })
  );
};

const ReminderItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  font-size: 0.9em;
  font-weight: bold;
  text-align: left;
`;

const CancelButton = styled.button`
  border: 1px solid #ccc;
  background-color: #cc3300;
  padding: 7px 20px;
  color: white;
  font-weight: bold;
  border-radius: 3px;
  cursor: pointer;
  position: absolute;
  right: 0px;
  top: 0px;
`;

export default MyReminderBoard;
