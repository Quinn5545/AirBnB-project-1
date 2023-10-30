import React, { useState } from "react";
import { useModal } from "../../context/Modal";
import { createReviewThunk, loadSpotReviewsThunk } from "../../store/reviews";
import { useDispatch, useSelector } from "react-redux";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { loadSpotDetailsThunk } from "../../store/spots";
import "./CreateReviewModal.css";

export default function CreateReviewModal({ spotId }) {
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [review, setReview] = useState("");
  const [selectedStars, setSelectedStars] = useState(0);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null); // State to store server error message

  const handleRatingChange = (newRating) => {
    setSelectedStars(newRating);
  };

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  const canSubmit = review.length >= 10 && selectedStars >= 1;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (review.length < 10) {
      newErrors.review = "Please include at least 10 characters";
    }
    if (selectedStars < 1) newErrors.stars = "Please give at least 1 star";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      const dataObj = {
        spotId,
        review,
        stars: selectedStars,
      };

      console.log("Review to be submitted:", dataObj);

      try {
        dispatch(createReviewThunk(spotId, review, selectedStars));
        dispatch(loadSpotReviewsThunk(spotId));
        closeModal();
        // history.push(`/spots/${spotId}`);
      } catch (error) {
        setServerError("An error occurred while submitting the review.");
      }
    }
    closeModal();
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const starClass = i <= selectedStars ? "fa-solid" : "fa-regular";
      stars.push(
        <i
          key={i}
          className={`fa-star ${starClass}`}
          onClick={() => handleRatingChange(i)}
        ></i>
      );
    }
    return stars;
  };

  return (
    <div className="create-review-modal">
      <h2>How was your stay?</h2>
      {serverError && <div className="server-error">{serverError}</div>}
      <textarea
        placeholder="Leave your review here..."
        value={review}
        onChange={handleReviewChange}
      />
      <div className="star-rating">{renderStars()}</div>
      <button onClick={handleSubmit} disabled={!canSubmit}>
        Submit Your Review
      </button>
    </div>
  );
}
