import React from "react";
import Avatar from "./Avatar/Avatar";
import "./Client.css";

const Client = ({ coderName }) => {
  return (
    <div className="client">
      <Avatar name={coderName} />
      <span className="coderName">{coderName}</span>
    </div>
  );
};

export default Client;
