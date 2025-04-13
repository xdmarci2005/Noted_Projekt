import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./components/home/Home";
import Main from "./components/Main/Main";
import Register from "./components/register/register";
import Login from "./components/login/login";
import Profile from "./components/Profile/Profile";
import Admin from "./components/admin/admin";
import EditUser from "./components/admin/components/editUser/editUser";
import Note from "./components/Note/Note";
import Search from "./components/Search/Search";
import  Group  from "./components/Group/Group";
import Error404 from "./components/404/Error404";

import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/editUser" element={<EditUser />} />
            <Route path="/note" element={<Note />} />
            <Route path="/search" element={<Search />} />
            <Route path="/group" element={<Group />} />
          </Route>
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
