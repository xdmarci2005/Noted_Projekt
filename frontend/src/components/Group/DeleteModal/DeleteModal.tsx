import React from "react";
import "./modal.scss"; // Import the CSS file

const CustomModal = ({
  show,
  title,
  message,
  onYes,
  OnNo,
}: {
  show: boolean;
  title: string;
  message: string;
  onYes: () => void;
  OnNo: any;
}) => {
  if (!show) return null; // Don't render the modal if `show` is false

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>
        <div className="modal-buttons">
          <span className="modal-yes-btn" onClick={onYes}>
            Igen
          </span>
          <span className="modal-no-btn" onClick={OnNo}>
            Nem
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
