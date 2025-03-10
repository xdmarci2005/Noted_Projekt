import logoImg from "../../assets/logo_main.png";
import "./Main.scss";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const Main = () => {
  const navigate = useNavigate();



  const renderContent = () => {
    return (
      <div className="main-site">
        <div className="card">
          <div className="content-container">
            <div className="logo-section">
              <img src={logoImg} alt="Noted Logo" className="logo" />
              <h1>Noted.</h1>
              <p>Jegyzeteid egyszerűen és rendszerezetten</p>
            </div>
            <div className="button-section">
              <button  onClick={() => navigate("/register")}>
                Regisztráció
              </button>
              <button  onClick={() => navigate("/login")}>
                Bejelentkezés
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return <>{renderContent()}</>;
};

export default Main;
