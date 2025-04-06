import { useEffect, useState } from "react";
import "./NewGroup.scss";
import Modal from './Modal/Modal';
import { X } from "lucide-react";


export default function NewGroup({ visible }: { visible: boolean }) {
  if (!visible) return null;

   const [showModal, setShowModal] = useState(false);

   const [modalMessage, setModalMessage] = useState<string>("");

  const onClose = () => {
    const token = localStorage.getItem("token");
    const value = (document.getElementById("group-field") as HTMLInputElement)
    if (value)
    if (!token) {
      console.error("Token not found in localStorage");
      return;
    } else
      fetch("http://localhost:3000/newGroup", {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-access-token": token,
        }),
        body: JSON.stringify({ Name:  value.value}),
      })
        .then((response) => response.json())
        .then((data) => {console.log(data);
          if (data.error) {
            setModalMessage(data.error);
            setShowModal(true);
          } else {
            setModalMessage("Csoport létrehozva!");
            setShowModal(true);
          }
        });
  };

  const close = ()  => {
    
   }

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <Modal
        show={showModal}
        title="Noted."
        message={modalMessage}
        onClose={() => handleModalClose()}
      />
      <div className="new-group">
        <div className="overlay">
          <div className="search-box">
            <span onClick={onClose} className="close">
              <X size={32} />
            </span>
            <h1>Új Csoport</h1>
            <div className="search-container">
              <input type="text" placeholder="Csoport Neve" id="group-field" />
            </div>

            <button className="create-btn" onClick={onClose}>
              Létrehozás
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
