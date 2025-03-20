import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Modal from "./components/Modal/Modal";
import {useState} from 'react';

const ProtectedRoute = () => {
  const [showModal, setShowModal] = useState(true);
  
  const navigate = useNavigate()

    const handleModalClose = () => {
      setShowModal(false);
      navigate('/');
    }

  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Modal
      show={showModal}
      title="Noted."
      message={"Nincs hozzáférése ehhez az oldalhoz!"}
      onClose={() => handleModalClose()}
    />
  );
};

export default ProtectedRoute;
