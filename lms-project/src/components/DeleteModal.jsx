import React from 'react';

function DeleteModal({ isOpen, onClose, onConfirm, leaveId, title }) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(leaveId); // Call the onConfirm handler passed as props
    onClose(); // Close the modal
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Are you sure you want to delete this {title}?</h2>
        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={onClose}>Cancel</button>
          <button className="modal-btn confirm" onClick={handleConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
