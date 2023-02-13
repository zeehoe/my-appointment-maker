import React, { useState } from "react";

const MyPhoneInput = ({ onChange = () => {} }) => {
  const [phone, setPhone] = useState("");
  const [isValid, setIsValid] = useState(true);

  const handlePhoneChange = (event) => {
    const { value } = event.target;
    const regex = /^(01)[0-46-9]-*[0-9]{7,8}$/;
    setIsValid(regex.test(value) || value == "");
    setPhone(value);
    onChange(value);
  };

  return (
    <>
      <input
        type="tel"
        id="phone"
        value={phone}
        onChange={handlePhoneChange}
        style={{ borderColor: isValid ? "" : "red" }}
      />
      {!isValid && <div className="warning">* Invalid phone number</div>}
    </>
  );
};

export default MyPhoneInput;
