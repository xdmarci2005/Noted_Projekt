import React, {PropsWithChildren} from "react";
import "./modal.scss"; 

const CustomModal = ({ show, title, message, onClose }:any) => {
  if (!show) return null; 

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>
        <button className="modal-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default CustomModal;
