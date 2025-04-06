import React, { useEffect, useState } from "react";
import "./home.scss";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { User } from "lucide-react";
import { Search } from "lucide-react";
import NewGroup from "./NewGroup/NewGroup";

const Home = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

 

  const closeNewGroup = () => {
    setIsSearchVisible(false);
    setModalMessage("Csoport létrehozva!");
    setShowModal(true);
  };

  const handleModalClose = () => {
    
  };

  const [content, setContent] = useState(
    "Üres, mint egy új kezdet. Jegyzetelj valamit!"
  );
  const [sharedContent, setSharedContent] = useState(
    "Úgy tűnik, itt még senki nem osztott meg semmit... Kezdjétek el közösen!"
  );
  const [groupContent, setGroupsContent] = useState(
    "Még nincsenek csoportok létrehozva. Hozz létre egyet, és kezdjétek el a közös munkát!"
  );
  const token = localStorage.getItem("token");
  useEffect(() => {
    fetch("http://localhost:3000/getNotes", {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-access-token": token,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  }, []);

  const requestAdmin = () => {};

  const navigate = useNavigate();

  const checkProfile = () => {
    navigate("/profile");
  };

  const handleSearch = () => {};

  const renderContent = () => {
    return (
      <>
        
        <NewGroup visible={isSearchVisible} onClose={() => closeNewGroup()} />
        <div className="home-site">
          <div className="top-bar">
            <button onClick={() => navigate("/note")}>
              {" "}
              <Plus />
            </button>
            <div className="search-container">
              <input type="text" placeholder="Keresés" id="search" />
              <Search className="icon" onClick={handleSearch} />
            </div>
            <button onClick={checkProfile}>
              {" "}
              <User />
            </button>
          </div>
          <div className="main-container">
            <div className="content">
              <div className="notes-section">
                <h2>Jegyzetek.</h2>
                <p className="empty-msg">{content}</p>
              </div>
              <div className="shared-notes-section">
                <h2>Megosztott jegyzetek.</h2>
                <p className="empty-msg">{sharedContent}</p>
              </div>
              <div className="group-section">
                <h2>Csoportok</h2>
                <p className="empty-msg">{groupContent}</p>
                <button onClick={() => setIsSearchVisible(true)}>
                  <Plus />
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  return renderContent();
};

export default Home;
