import React, { useState } from "react";
import "./modal.scss"; 

const CustomModal = ({ show, title, message, onYes, onNo, note, user }: any) => {
  if (!show) return null; 
  const [permission, setPermission] = useState<any>("R");
  const token = localStorage.getItem("token");
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>
        <span className="shareOptions">
          <span
            className={permission == "R" ? "active-span" : "inactive-span"}
            onClick={() => setPermission("R")}
          >
            Olvasó
          </span>
          <span
            className={permission == "RW" ? "active-span" : "inactive-span"}
            onClick={() => setPermission("RW")}
          >
            Szerkeztő
          </span>
          <span
            className={permission == "RWS" ? "active-span" : "inactive-span"}
            onClick={() => setPermission("RWS")}
          >
            Moderátor
          </span>
        </span>
        <div className="modal-buttons">
          <span
            className="modal-yes-btn"
            onClick={() => {
              if (note) {
                if (token)
                  fetch(
                    `http://localhost:3000/updateShare/${note.MegosztasId}`,
                    {
                      method: "PUT",
                      headers: new Headers({
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "x-access-token": token,
                      }),
                      body: JSON.stringify({ Jogosultsag: permission }),
                    }
                  )
                    .then((response) => response.json())
                    .then((data) => console.log(data));
              }
              if (user) {
                if (token)
                  fetch(
                    `http://localhost:3000/updateShare/${user.MegosztasId}`,
                    {
                      method: "PUT",
                      headers: new Headers({
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "x-access-token": token,
                      }),
                      body: JSON.stringify({ Jogosultsag: permission }),
                    }
                  )
                    .then((response) => response.json())
                    .then((data) => console.log(data));
              }
              
                  
              onYes();
            }}
          >
            Igen
          </span>
          <span className="modal-no-btn" onClick={onNo}>
            Nem
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
