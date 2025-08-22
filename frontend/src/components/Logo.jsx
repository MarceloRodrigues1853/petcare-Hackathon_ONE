import React from "react";
import logo from "../assets/images/logo.png";

export default function Logo(){
  return (
    <div className="logo">
      <img src={logo} alt="PetCare Logo" />
      {/* <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="4">
        <path d="M10 22c6-10 26-12 36 0 6 6 6 16 0 22-8 8-20 8-28 0" strokeLinecap="round"/>
        <circle cx="38" cy="28" r="2" fill="currentColor" stroke="none"/>
        <path d="M14 36l-2 14" strokeLinecap="round"/>
      </svg> */}
      {/* <span>PetCare</span> */}
    </div>
  );
}