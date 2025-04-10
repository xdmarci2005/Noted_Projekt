import React, { useEffect, useState } from "react";
import "./home.scss";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { User } from "lucide-react";
import { Search } from "lucide-react";
import NewGroup from "./NewGroup/NewGroup";
import Modal from "./NewGroup/Modal/Modal";

const Home = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [groups, setGroups] = useState([]);
  const [content, setContent] = useState<any>();
  const [sharedContent, setSharedContent] = useState<any>();
  const [groupContent, setGroupsContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [sharedNotes, setSharedNotes] = useState([]);
  const [modalMessage, setModalMessage] = useState("");

  const token = localStorage.getItem("token");
  const getNotes = async () => {
    if (token) {
      await fetch("http://localhost:3000/getNotes", {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-access-token": token
        })
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setNotes(data.data);
        });
    }
  };

  const getSharedWithNotes = async () =>{
    if(token){
      fetch('http://localhost:3000/sharedWithUser', {
        method:'GET',
        headers: new Headers({
          "Content-Type": "application/json",
          "Accept": "application/json",
          "x-access-token":token
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setSharedNotes(data.data)
      });
    }
  }

  useEffect(() => {
    if (notes) {
      
      setContent(
        notes.map((n : any) => {
          const tmpjegyzetnev = n.JegyzetNeve;
          const jegyzetnev = tmpjegyzetnev.substring(
            tmpjegyzetnev.indexOf("_") + 1
          );
          return (
            <span
              className="note-item"
              key={n.JegyzetId}
              onClick={() => navigate("/note/", { state: { id: n.JegyzetId, name: jegyzetnev } })}
            >
              {jegyzetnev}
            </span>
          );
        })
        
      );
    }
    else {
      setContent(
        <p className="empty-msg">{"Üres, mint egy új kezdet. Jegyzetelj valamit!"}</p>
      );
    }
  }, [notes]);

  useEffect(() => {
    if (sharedNotes) {
      setSharedContent(
        sharedNotes.map((n : any) => {
          const tmpjegyzetnev = n.JegyzetNeve;
          const jegyzetnev = tmpjegyzetnev.substring(
            tmpjegyzetnev.indexOf("_") + 1
          );
          return (
            <span
              className="note-item"
              key={n.JegyzetId}
              onClick={() => navigate("/note/", { state: { id: n.JegyzetId, name: jegyzetnev } })}
            >
              {jegyzetnev}
            </span>
          );
        })
        
      );
    }
    else {
      setSharedContent(
        <p className="empty-msg">{"Úgy tűnik, itt még senki nem osztott meg semmit... Kezdjétek el közösen!"}</p>
      );
    }
  }, [sharedNotes]);

  useEffect(() => {
    getNotes();
    getSharedWithNotes();
  }, []);

  const onCreate = () => {
    const value = (document.getElementById("group-field") as HTMLInputElement)
      .value;
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
          body: JSON.stringify({ Name: value }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            if (data.error) {
              setModalMessage(data.error);
              setShowModal(true);
            } else {
              setIsSearchVisible(false);
              setModalMessage("Csoport létrehozva!");
              setShowModal(true);
            }
          });
  };

  const onClose = () => {
    setIsSearchVisible(false);
  };

  const handleModalClose = () => {
    setShowModal(false);
    showGroups();
  };

  const showGroups = () => {
    if (token)
      fetch("http://localhost:3000/getGroupsByMember", {
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
          setGroups(data.data);
          if (data.length > 0) {
            setGroupsContent("");
          }
        });
  };

  useEffect(showGroups, []);

  const clickGroupItem = (id:any, name:any) => {
    navigate("/group", { state: { id: id, name: name } });
  };

  const navigate = useNavigate();

  const checkProfile = () => {
    navigate("/profile");
  };

  const handleSearch = () => {};

  return (
    <>
      <Modal
        show={showModal}
        title="Noted."
        message={modalMessage}
        onClose={() => handleModalClose()}
      />
      <NewGroup
        visible={isSearchVisible}
        onClose={() => onClose()}
        onCreate={() => {
          onCreate();
        }}
      />
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
              <div className="notes">{content}</div>
            </div>
            <div className="shared-notes-section">
              <h2>Megosztott jegyzetek.</h2>
              <div className="shares">{sharedContent}</div>
            </div>
            <div className="group-section">
              <h2>Csoportok</h2>
              <p className="empty-msg">{groupContent}</p>
              <div className="groups">
                {groups &&
                  groups.map((group : any) => (
                    <div
                      key={group.CsoportId}
                      className="group-item"
                      onClick={() => clickGroupItem(group.CsoportId, group.CsoportNev)}
                    >
                      {group.CsoportNev}
                    </div>
                  ))}
              </div>
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

export default Home;
