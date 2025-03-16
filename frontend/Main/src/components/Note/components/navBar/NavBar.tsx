import React, { useState } from "react";
import "./Navbar.scss"; // Import the CSS file
import { FaUser, FaShareAlt } from "react-icons/fa";
import logoImg from "../logo_main.png";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  setIsDropdownOpen: (isOpen: boolean) => void;
}

export default function Navbar({ setIsDropdownOpen }: NavbarProps) {
  const [docTitle, setDocTitle] = useState("Névtelen Dokumentum");

  const [dropdownOpen, setDropdownOpen] = useState(null);

  const navigate = useNavigate();

  function handleOpen() {}

  function handleProfile() {
    navigate("/profile");
  }
  const toggleDropdown = (menu: string) => {
    const isOpen = dropdownOpen === menu ? null : menu;
    setDropdownOpen(isOpen);
    setIsDropdownOpen(isOpen !== null);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <span className="icon">
            <img src={logoImg} alt="Noted Logo" className="logo" />
          </span>
          <input
            type="text"
            className="doc-title"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
          />
        </div>

        <div className="navbar-center">
          <span
            onClick={() => {
              handleOpen();
            }}
          >
            Megnyitás
          </span>
          <span
            onClick={() => {
              toggleDropdown("mentes");
            }}
          >
            Mentés
          </span>

          {dropdownOpen === "mentes" && (
            <div className="dropdown">
              <p>.docx formátumban</p>
              <p>.md formátumban</p>
              <p>.odt formátumban</p>
            </div>
          )}

          <span
            onClick={() => {
              toggleDropdown("szerkeztes");
            }}
          >
            Szerkeztés
          </span>

          {dropdownOpen === "szerkeztes" && (
            <div className="dropdown">
              <p>Visszavonás</p>
              <p>Újra</p>
              <p>Másolás</p>
              <p>Kivágás</p>
              <p>Beillesztés</p>
            </div>
          )}
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
    </>
  );
}
