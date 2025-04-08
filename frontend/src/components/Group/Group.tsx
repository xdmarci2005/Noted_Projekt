import { useLocation, useNavigate } from "react-router-dom";
import "./group.scss";
import { useEffect, useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";

export default function Group() {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState<any>();
  const [notes, setNotes] = useState<any>();

  const navigate = useNavigate();

  const [addHover, setAddHover] = useState(false);
  const [backHover, setBackHover] = useState(false);

  const location = useLocation();
  const groupId = location.state?.id;
  const groupName = location.state?.name;

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
    }
  }, [groupId]);

  return (
    <div className="group-site">
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
                  {user.FelhasznaloNev}
                </span>
              ))}
          </div>
          <div className="notes-section">
            <h2>Jegyzetek.</h2>
            <div className="notes">
              <div className="note-item" onClick={() => {}}>
                {"jegyzet1"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
