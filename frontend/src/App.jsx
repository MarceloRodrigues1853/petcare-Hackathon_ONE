// frontend/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles.css";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        {/* por enquanto manda a raiz pro login */}
        <Route path="/" element={<Navigate to="/login" replace/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        {/* futuro: <Route path="/home" element={<Home/>} /> */}
      </Routes>
    </BrowserRouter>
  );
}
