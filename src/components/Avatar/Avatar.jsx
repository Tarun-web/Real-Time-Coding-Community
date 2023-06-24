import React from "react";
import "./Avatar.css";

const Avatar = ({ name }) => {
  const initials = name
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("");

  return (
    <div className="avatar">
      <span className="initials">{initials}</span>
    </div>
  );
};

export default Avatar;
