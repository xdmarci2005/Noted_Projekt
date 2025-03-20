import React, { useEffect } from "react";
import "./home.scss";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { User } from "lucide-react";


const Home = () => {
  const requestAdmin = () => {};

  const navigate = useNavigate();

  const checkProfile = () => {
    navigate("/profile");
  };

  const renderContent = () => {
    return (
      <div className="home-site">
        <div className="top-bar">
          <button onClick={() => navigate("/note")}>
            {" "}
            <Plus />
          </button>
          <input type="text" className="search-bar" placeholder="Keresés" />
          <button onClick={checkProfile}>
            {" "}
            <User />
          </button>
        </div>
        <div className="main-container">
          <div className="content">
            <div className="notes-section">
              <h2>Jegyzetek.</h2>
              <p className="empty-msg">
                Üres, mint egy új kezdet. Jegyzetelj valamit!
              </p>
            </div>
            <div className="shared-notes-section">
              <h2>Megosztott jegyzetek.</h2>
              <p className="empty-msg">
                Úgy tűnik, itt még senki nem osztott meg semmit... Kezdjétek el
                közösen!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return renderContent();
};

export default Home;
