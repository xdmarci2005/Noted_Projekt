import { useEffect, useState } from "react";
import "./style.scss";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const handleEdit = () => {};
  const navigate = useNavigate();

  const onEdit = (id) => {
    localStorage.setItem("currentEditingUser", id);
    navigate("/editUser");
  };

  const handleDelete = () => {};

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/Admgetusers", {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-access-token": localStorage.getItem("token"),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.log(data);
        } else {
          //console.log(users);
          setUsers(data.data);
        }
      });
  }, []);

  //console.log(users);

  return (
    <div className="admin-site">
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => {
              return (
                <tr key={user.FelhasznaloId}>
                  <td>{user.FelhasznaloId}</td>
                  <td>{user.FelhasznaloNev}</td>
                  <td>{user.Email}</td>
                  <td className="actions">
                    <button onClick={() => onEdit(user.FelhasznaloId)}>
                      Edit
                    </button>
                    <button onClick={handleDelete}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
