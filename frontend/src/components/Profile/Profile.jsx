import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";
import React, { useEffect, useState } from "react";
import { Pencil, ArrowLeft, PencilOff } from "lucide-react";

import "./profile.scss";

const Profile = () => {
  const navigate = useNavigate();

  const { logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [modalMessage, setModalMessage] = useState();

  const [path, setPath] = useState("/");

  const [backHover, setBackHover] = useState(false);

  const handleLogout = () => {
    event.preventDefault();
    setModalMessage("Sikeres Kijelentkezés");
    setShowModal(true);
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleModalClose = () => {
    setShowModal(false);
    if (path != "") {
      navigate(path);
    }
    if (logout) {
      localStorage.removeItem("token");
      logout();
      navigate("/");
    }
  };

  useEffect(() => {
    fetch("http://localhost:3000/getUser", {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-access-token": localStorage.getItem("token"),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        document.getElementById("username").value = data.data.FelhasznaloNev;
        document.getElementById("email").value = data.data.Email;
      });
  }, []);

  const editProfile = (user, email, password) => {
    event.preventDefault();
    fetch("http://localhost:3000/updateuser", {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-access-token": localStorage.getItem("token"),
      }),
      body: JSON.stringify({
        Email: email,
        Jelszo: password,
        FelhasznaloNev: user,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setModalMessage(data.success);
          console.log(data.success);
          setPath("/home");
          setShowModal(true);
        } else {
          setModalMessage(data.error);
          setPath("");
          setShowModal(true);
          console.log(data.error);
        }
      });
  };

  const renderContent = () => {
    return (
      <>
        <Modal
          show={showModal}
          title="Noted."
          message={modalMessage}
          onClose={() => handleModalClose()}
        />
        <div className="profile-site">
          <div className="top-bar">
            <span
              className="back-button"
              onClick={() => {
                navigate(-1);
              }}
              onMouseEnter={() => setBackHover(true)}
              onMouseLeave={() => setBackHover(false)}
            >
              <ArrowLeft />
              <span className={`Backtooltip ${backHover ? "onHover" : ""}`}>
                Vissza
              </span>
            </span>
          </div>
          <div className="card">
            <form onSubmit={(event) => event.preventDefault()}>
              <h2>Profil szerkeztése</h2>
              <div>
                <label htmlFor="username">Felhasználónév:</label>
                <input
                  className="input-field"
                  type="text"
                  id="username"
                  name="username"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label htmlFor="email">Email:</label>
                <input
                  className="input-field"
                  type="email"
                  id="email"
                  name="email"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label htmlFor="password">Jelszó:</label>
                <input
                  className="input-field"
                  type="password"
                  id="password"
                  name="password"
                  readOnly
                  onFocus={(e) => e.target.removeAttribute("readonly")}
                  disabled={!isEditing}
                />
              </div>
              <div className="edit-field">
                <button
                  onClick={(event) => (
                    event.preventDefault(),
                    editProfile(
                      document.getElementById("username").value,
                      document.getElementById("email").value,
                      document.getElementById("password").value
                    )
                  )}
                  className="save"
                >
                  Változtatások mentése
                </button>
                <button
                  onClick={handleEdit}
                  className={`edit ${isEditing ? "isActive" : ""}`}
                >
                  {isEditing ? <PencilOff /> : <Pencil />}
                </button>
              </div>
              <div className="logout-field">
                <button onClick={handleLogout}>Kijelentkezés</button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  };

  return renderContent();
};

export default Profile;
