import React from "react";
import logo from "../assets/images/logo.png";

export default function Logo(){
  return (
    <div className="logo">
      <img src={logo} alt="PetCare Logo" />
    </div>
  );
}