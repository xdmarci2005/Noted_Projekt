import React from "react";
import "./modal.scss"; // Import the CSS file

const CustomModal = ({ show, title, message, onClose }) => {
  if (!show) return null; // Don't render the modal if `show` is false

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
