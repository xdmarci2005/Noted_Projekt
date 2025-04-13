import { useLocation, useNavigate } from "react-router-dom";
import "./group.scss";
import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

import SearchOverlay from "../Groups/SearchOverlay/SearchOverlay";
import CustomModal from "../home/NewGroup/Modal/Modal";

export default function Group() {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState<any>();
  const [notes, setNotes] = useState<any>();
  const [content, setContent] = useState<any>();

  const navigate = useNavigate();

  const [addHover, setAddHover] = useState(false);
  const [backHover, setBackHover] = useState(false);

  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [currentModal, setCurrentModal] = useState("");

  const [modalMessage, setModalMessage] = useState("");

  const [user, setUser] = useState({});
  const [note, setNote] = useState({});

  const location = useLocation();
  const groupId = location.state?.id;
  const groupName = location.state?.name;

  function handleModalClose() {
    if (currentModal == "note") {
    } else if (currentModal == "user") {
      removeUser()
    } else {
      console.log("Error: miafasz");
    }
    setShowModal(false);
  }

  async function removeUser() {
    if (token)
      fetch("http://localhost:3000/removeMember", {
        method: "DELETE",
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-access-token": token,
        }),
        body: JSON.stringify({ CsoportId: groupId, TagId: 1 }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
  }

  async function removeNote() {
    
  }

  useEffect(() => {
    if (token) {
      fetch(`http://localhost:3000/GroupMembers/${groupId}`, {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-access-token": token,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);

          setUsers(data.data);
          if (data.length > 0) {
            setUsers("Nem találhatóak tagok.");
          }
        });

      fetch(`http://localhost:3000/sharedWithGroup/${groupId}`, {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-access-token": token,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);

          setNotes(data.data);
        });
    }
  }, [groupId]);

  useEffect(() => {
    if (notes) {
      setContent(
        notes.map((n: any) => {
          const tmpjegyzetnev = n.JegyzetNeve;
          const jegyzetnev = tmpjegyzetnev.substring(
            tmpjegyzetnev.indexOf("_") + 1
          );
          return (
            <span className="note-item" key={n.JegyzetId}>
              <span
                className="name"
                onClick={() =>
                  navigate("/note/", {
                    state: { id: n.JegyzetId, name: jegyzetnev },
                  })
                }
              >
                {jegyzetnev}
              </span>
              <span
                className="delete"
                onClick={() => {
                  setNote(n);
                  setModalMessage(
                    `Biztosan törli a(z) ${jegyzetnev} nevű jegyzetet? `
                  );
                  setCurrentModal("note");
                  setShowModal(true);
                }}
              >
                <Trash2 />
              </span>
            </span>
          );
        })
      );
    } else {
      setContent(<p className="empty-msg">{"Nincsenek jegyzetek."}</p>);
    }
  }, [notes]);

  return (
    <div className="group-site">
      <CustomModal
        show={showModal}
        title="Noted."
        message={modalMessage}
        onClose={() => handleModalClose()}
      />
      <SearchOverlay
        visible={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
        groupId={groupId}
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
        <span
          className="add"
          onMouseEnter={() => setAddHover(true)}
          onMouseLeave={() => setAddHover(false)}
        >
          <Plus />
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
            <h2>Tagok</h2>
            {users &&
              users.map((user: any, index: number) => (
                <span className="member-item" key={index}>
                  <span className="name">{user.FelhasznaloNev}</span>
                  <span
                    className="delete"
                    onClick={() => {
                      setModalMessage(
                        `Biztosan törli a(z) ${user.FelhasznaloNev} nevű felhasználót? `
                      );
                      setUser(user);
                      setCurrentModal("user");
                      setShowModal(true);
                    }}
                  >
                    <Trash2 />
                  </span>
                </span>
              ))}
          </div>
          <div className="notes-section">
            <h2>Jegyzetek</h2>
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}
