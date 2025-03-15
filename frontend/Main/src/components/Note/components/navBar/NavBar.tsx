import React, { useState } from "react";
import "./Navbar.scss"; // Import the CSS file
import { FaUser, FaShareAlt } from "react-icons/fa";
import logoImg from "../logo_main.png";
import { useNavigate } from "react-router-dom";


export default function Navbar() {
  const [docTitle, setDocTitle] = useState("Untitled Document");

  const navigate = useNavigate()

  function handleProfile() {
    navigate("/profile");
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="icon">
          <img src={logoImg} alt="Noted Logo" className="logo" />
        </span>
        <h1 className="app-title">Noted</h1>
      </div>

      <div className="navbar-center">
        <input
          type="text"
          className="doc-title"
          value={docTitle}
          onChange={(e) => setDocTitle(e.target.value)}
        />
      </div>

      <div className="navbar-right">
        <button className="btn share-btn">
          <span className="icon">
            <FaShareAlt />
          </span>{" "}
          Share
        </button>
        <button className="btn profile-btn" onClick={handleProfile}>
          <span className="icon">
            <FaUser />
          </span>
        </button>
      </div>
    </nav>
  );
}
