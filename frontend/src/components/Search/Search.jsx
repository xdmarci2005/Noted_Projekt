import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./search.scss";

class User {
  id = Number;
  nev = String;
}

export default function Search() {
  const location = useLocation();
  const value = location.state?.value;

  const [users, setUsers] = useState([]);

  const [content, setContent] = useState();

  function renderUsers() {
    setContent(
      <>
        <h1>Találatok</h1>
        <table>
          <thead>
            <tr>
              <th>Név</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              return (
                <tr key={u.id}>
                  <td>{u.nev}</td>
                  <td></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function fetchData() {
      await fetch(`http://localhost:3000/getUserByName/${value}`, {
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
          if (data.data && data.data.length != 0) {
            data.data.map((u) => {
              const user = new User();
              user.id = u.FelhasznaloId;
              user.nev = u.FelhasznaloNev;
              setUsers(users.push(user));
              renderUsers();
            });
          } else {
            setContent(
              <>
                <h1>No User Found!</h1>
              </>
            );
          }
        });
    }
    fetchData();
  }, []);

  return (
    <>
      <div className="search-site">
        <div className="search-card">
          {content}
        </div>
      </div>
    </>
  );
}
