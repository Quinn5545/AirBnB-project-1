import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import "./DeleteReviewModal.css";
import { deleteReviewThunk } from "../../store/reviews";

export default function DeleteReviewModal({ reviewId }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();

  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(deleteReviewThunk(reviewId));
    closeModal();
  };

  const close = (e) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <div className="box">
      <div className="delete-title">Confirm Delete</div>
      <div className="delete-text">
        Are you sure you want to delete this review?
      </div>
      <div className="yes-button">
        <button className="yes-button" onClick={handleDelete}>
          Yes (Delete Review)
        </button>
      </div>
      <div className="no-button">
        <button className="no-button" onClick={close}>
          No (Keep Review)
        </button>
      </div>
    </div>
  );
}
