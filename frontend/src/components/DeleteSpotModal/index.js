import React from "react";
import "./DeleteSpotModal.css";
import { deleteSpotThunk, loadSpotsThunk } from "../../store/spots";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";

export default function DeleteSpotModal({ spotId }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();

  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(deleteSpotThunk(spotId));
    dispatch(loadSpotsThunk());
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
        Are you sure you want to remove this spot from the listings?
      </div>
      <div className="buttons-box">
        <div className="yes-button">
          <button className="yes-button" onClick={handleDelete}>
            Yes (Delete Spot)
          </button>
        </div>
        <div className="no-button">
          <button className="no-button" onClick={close}>
            No (Keep Spot)
          </button>
        </div>
      </div>
    </div>
  );
}
