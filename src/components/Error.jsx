import React from "react";
import errorMsg from "../assets/404.svg";

const Error = ({ message }) => {
  return (
    <div>
      <img src={errorMsg} alt="Error" className="error-image" />
      <p>{message}</p>
      <button> Yukarıya çık</button>
    </div>
  );
};

export default Error;
