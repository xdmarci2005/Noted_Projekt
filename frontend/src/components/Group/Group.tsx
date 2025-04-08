import { useLocation, useNavigate } from "react-router-dom";
import "./group.scss";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

interface User {
  id: number;
  name: string;
}

interface Note {
  id: number;
  title: string;
}

export default function Group() {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState<User[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  const navigate = useNavigate();

  const location = useLocation();
  const groupId = location.state?.id;

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
        .then((data) => console.log(data));
    }
  }, [groupId]);

  return (
    <div className="group-site">
      <div className="top-bar">
        <span className="back" onClick={() => navigate('/home')}>
          <ArrowLeft />
        </span>
        <h1 className="title-card">Csoportok</h1>
      </div>
      <div className="main-container">
        <div className="content">
          <div className="members-section">
            <h2>Tagok</h2>
            <span className="member-item">Tag1</span>
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
