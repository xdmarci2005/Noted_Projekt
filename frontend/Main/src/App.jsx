import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/home/Home";
import Main from "./components/Main/Main";
import Register from "./components/register/register";
import Login from "./components/login/login";
import Profile from "./components/Profile/Profile";
import Admin from "./components/admin/admin";
import EditUser from "./components/admin/components/editUser/editUser";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home/>} />
        <Route path="/" element={<Main/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/admin" element={<Admin/>}/>
        <Route path="/editUser" element={<EditUser/>}/>
      </Routes>
    </Router>
  );
};

export default App;