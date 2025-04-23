import React, { useState } from "react";
import logoImg from "../../public/logo_main.png";
import "./register.scss";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";
import eyeClose from "../../assets/eye-close.png";
import eyeOpen from "../../assets/eye-open.png";

const RegisterScreen = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  const [isSucces, setIsSuccess] = useState(false);

  const [modalMessage, setModalMessage] = useState();

  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = (event) => {
    setShowPassword(!showPassword);
    event.preventDefault();
  };

  const handleModalClose = () => {
    setShowModal(false);
    if (isSucces) {
      navigate("/login");
    }
  };

  const renderContent = () => {
    const navigate = useNavigate();

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
            <a onClick={() => navigate("/")}>
              <img src={logoImg} alt="Noted Logo" className="logo" />
            </a>
            <h1>Noted.</h1>
            <p>Jegyzeteid egyszerűen és rendszerezetten</p>
          </div>
          <div className="form-section">
            <form className="register-form">
              <input
                type="text"
                placeholder="felhasználónév"
                id="username"
                className="input-field"
                autoComplete="off"
                readOnly
                onFocus={(e) => e.target.removeAttribute("readonly")}
              />
              <input
                type="email"
                placeholder="e-mail cím"
                id="email"
                className="input-field"
                readOnly
                onFocus={(e) => e.target.removeAttribute("readonly")}
              />
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="jelszó"
                  id="password"
                  readOnly
                  onFocus={(e) => e.target.removeAttribute("readonly")}
                />
                <img
                  src={showPassword ? eyeOpen : eyeClose}
                  onClick={togglePassword}
                  alt="Show Password"
                />
              </div>
              <button
                name="registersubmitbtn"
                type="submit"
                className="btn"
                onClick={(event) => {
                  event.preventDefault();
                  fetch("http://localhost:3000/register", {
                    method: "POST",
                    headers: new Headers({
                      "Content-Type": "application/json",
                      Accept: "application/json",
                    }),
                    body: JSON.stringify({
                      FelhasznaloNev: document.getElementById("username").value,
                      Jelszo: document.getElementById("password").value,
                      Email: document.getElementById("email").value,
                      Statusz: 1,
                      JogosultsagId: 1,
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
                        //       console.log(data);
                      }
                    })
                    .catch((error) => console.log(error));
                }}
              >
                Regisztráció
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return renderContent();
};

export default RegisterScreen;
