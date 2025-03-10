import React, { useState } from "react";
import logoImg from "../../assets/logo_main.png";
import { useNavigate } from "react-router-dom";
import "./login.scss";
import Modal from "../Modal/Modal";
import eyeClose from "../../assets/eye-close.png";
import eyeOpen from "../../assets/eye-open.png";


const LoginScreen = () => {
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
      navigate("/home");
    }
  };

  const renderContent = (e) => {
    return (
      <div className="login-site">
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
            <form className="login-form">
              <input
                type="email"
                placeholder="e-mail cím"
                id="email"
                className="input-field"
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
              <button
                type="submit"
                className="btn"
                onClick={(event) => {
                  event.preventDefault();
                  fetch("http://localhost:3000/login", {
                    method: "POST",
                    headers: new Headers({
                      "Content-Type": "application/json",
                      Accept: "application/json",
                    }),
                    body: JSON.stringify({
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
                        console.log(data.Token);
                        localStorage.setItem("token", data.Token);
                      }
                    });
                }}
              >
                Bejelentkezés
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return renderContent();
};

export default LoginScreen;
