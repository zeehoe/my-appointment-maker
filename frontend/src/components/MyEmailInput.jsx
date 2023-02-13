import React, { useState } from "react";

const MyEmailInput = ({ onChange }) => {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(true);

  const handleChange = (event) => {
    const value = event.target.value;
    setEmail(value);
    setIsValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value =="");
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <>
      <input
        type="email"
        value={email}
        onChange={handleChange}
        style={{ borderColor: isValid ? "" : "red" }}
      />
      {!isValid && (
        <div className="warning">* Please enter a valid email address.</div>
      )}
    </>
  );
};

export default MyEmailInput;
