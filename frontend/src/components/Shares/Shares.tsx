import { useLocation, useNavigate } from "react-router-dom";
import "./shares.scss";
import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

import CustomModal from "../Group/DeleteModal/DeleteModal";

export default function Group() {
  const token = localStorage.getItem("token");
  const [sharedWithUsers, setSharedWithUsers] = useState<any>([]);
  const [sharedWithGroups, setSharedWithGroups] = useState<any>([]);

  const [Usercontent, setUserContent] = useState<any>();
  const [Groupcontent, setGroupcontent] = useState<any>();

  const navigate = useNavigate();

  const [addHover, setAddHover] = useState(false);
  const [backHover, setBackHover] = useState(false);

  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [currentModal, setCurrentModal] = useState("");

  const [modalMessage, setModalMessage] = useState("");

  const [note, setNote] = useState({});

  const location = useLocation();
  const groupId = location.state?.id;
  const groupName = location.state?.name;

  function handleModalClose() {
    removeNote();
    setShowModal(false);
  }

  function fetchShares() {
    if (token) {
      fetch("http://localhost:3000/sharesBy", {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-access-token": token,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.GroupShares);
          setSharedWithGroups(data.GroupShares);
          setSharedWithUsers(data.UserShares);
        })
        .catch((error) => console.error("Hiba a fetch során:", error));
    }
  }
  useEffect(() => {
    fetchShares();
  }, [token]);

  function refreshUserContent() {
    setUserContent(
      sharedWithUsers.map((note: any, index: number) => {
        const tmpjegyzetnev = note.JegyzetNeve;
        const jegyzetnev = tmpjegyzetnev.substring(
          tmpjegyzetnev.indexOf("_") + 1
        );
        return (
          <span className="member-item" key={index}>
            <span className="name">{jegyzetnev}</span>
            <span
              className="delete"
              onClick={() => {
                setModalMessage(
                  `Biztosan törli a(z) ${jegyzetnev} nevű felhasználót? `
                );
                setNote(note);
                setCurrentModal("user");
                setShowModal(true);
              }}
            >
              <Trash2 />
            </span>
          </span>
        );
      })
    );
  }
  useEffect(() => {
    refreshUserContent();
  }, [sharedWithUsers]);

  function refreshGroupContent() {
    setGroupcontent(
      sharedWithGroups.map((note: any, index: number) => {
        const tmpjegyzetnev = note.JegyzetNeve;
        const jegyzetnev = tmpjegyzetnev.substring(
          tmpjegyzetnev.indexOf("_") + 1
        );
        return (
          <span className="member-item" key={index}>
            <span className="name">{jegyzetnev}</span>
            <span
              className="delete"
              onClick={() => {
                setModalMessage(
                  `Biztosan törli a(z) ${jegyzetnev} nevű felhasználót? `
                );
                setNote(note);
                setCurrentModal("user");
                setShowModal(true);
              }}
            >
              <Trash2 />
            </span>
          </span>
        );
      })
    );
  }
  useEffect(() => {
    refreshGroupContent();
  }, [sharedWithGroups]);

  async function removeNote() {
    if (token)
      fetch(`http://localhost:3000/deleteShare/${note.MegosztasId}`, {
        method: "DELETE",
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-access-token": token,
        }),
        body: JSON.stringify({}),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          fetchShares()
        });
  }

  async function closeSearch() {
    setIsSearchVisible(false);
  }

  return (
    <div className="group-site">
      <CustomModal
        show={showModal}
        title="Noted."
        message={modalMessage}
        onYes={() => handleModalClose()}
        OnNo={() => {
          setShowModal(false);
        }}
      />
      <div className="top-bar">
        <span
          className="back"
          onClick={() => navigate("/home")}
          onMouseEnter={() => setBackHover(true)}
          onMouseLeave={() => setBackHover(false)}
        >
          <ArrowLeft />
        </span>
      </div>
      <span className={`Backtooltip ${backHover ? "onHover" : ""}`}>
        Vissza a főoldalra
      </span>

      <span className={`Addtooltip ${addHover ? "onHover" : ""}`}>
        Ember Hozzáadása
      </span>
      <h1 className="title-card">{groupName}</h1>
      <div className="main-container">
        <div className="content">
          <div className="members-section">
            <h2>Emberekkel Megosztva</h2>
            <div className="member-notes">{Usercontent}</div>
          </div>
          <div className="notes-section">
            <h2>Csoportokkal Megosztva</h2>
            {Groupcontent}
          </div>
        </div>
      </div>
    </div>
  );
}
