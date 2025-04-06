import React, { useEffect, useState } from "react";
import "./editUser.scss";
import { useNavigate } from "react-router-dom";
import eyeClose from "../../../../assets/eye-close.png";
import eyeOpen from "../../../../assets/eye-open.png";
import Modal from "../../../Modal/Modal";

const editUser = ({ show, onClose, children }) => {
  //use commands/ values //#region
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  const [isSucces, setIsSuccess] = useState(false);

  const [modalMessage, setModalMessage] = useState();

  const [showPassword, setShowPassword] = useState(false);

  const [user, setUser] = useState({});

  const id = localStorage.getItem("currentEditingUser");

  const token = localStorage.getItem("token");

  const togglePassword = (event) => {
    setShowPassword(!showPassword);
    event.preventDefault();
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Megakadályozza az oldal újratöltését
  };
  //#endregion

  const getUserEndPoint = `http://localhost:3000/Admgetuserbyid/${id}`;
  useEffect(() => {
    fetch(getUserEndPoint, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-access-token": token,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data.data);
      });
  }, []);
  //console.log(user);

  //eventHandlers
  //#region
  const handleModalClose = () => {
    setShowModal(false);
    if (isSucces) {
      navigate("/admin");
    }
  };

  const handleChanges = () => {
    fetch(`http://localhost:3000/Admupdateuser/${id}`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-access-token": token,
      }),
      body: JSON.stringify({
        FelhasznaloNev: document.getElementById("username").value,
        Jelszo: document.getElementById("password").value,
        Email: document.getElementById("email").value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setIsSuccess(false);
          setModalMessage(data.error);
          setShowModal(true);
          console.log(data);
        } else {
          setIsSuccess(true);
          setModalMessage(data.success);
          setShowModal(true);
          //console.log(data);
        }
      });
  };
  const handleDelete = () => {
    fetch(`http://localhost:3000/Admdeleteuser/${id}`, {
      method: "DELETE",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-access-token": token,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  };
  const handleAbort = () => {
    localStorage.removeItem("currentEditingUser");
    navigate("/admin");
  };
  //#endregion

  return (
    <div className="register-site">
      <Modal
        show={showModal}
        title="Noted."
        message={modalMessage}
        onClose={() => handleModalClose()}
      />
      <div className="card">
        <div className="logo-section">
          <h1>Adatok szerkeztése</h1>
          <p>Jegyzeteid egyszerűen és rendszerezetten</p>
        </div>
        <div className="form-section">
          <form className="register-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="felhasználónév"
              id="username"
              className="input-field"
              defaultValue={user.FelhasznaloNev}
            />
            <input
              type="text"
              placeholder="e-mail cím"
              id="email"
              className="input-field"
              defaultValue={user.Email}
            />
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="jelszó"
                id="password"
              />
              <img
                src={showPassword ? eyeOpen : eyeClose}
                onClick={togglePassword}
                alt="Show Password"
              />
            </div>
            <button className="btn" onClick={handleChanges}>
              Szerkeztések mentése
            </button>
            <button className="btn" onClick={handleDelete}>
              Felhasználó törlése
            </button>
            <button className="btn" onClick={handleAbort}>
              Mégsem
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default editUser;
