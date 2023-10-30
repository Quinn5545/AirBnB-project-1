import { csrfFetch } from "./csrf";

// exports
export const LOAD_SPOT_REVIEWS = "reviews/loadSpotReviews";
export const CREATE_REVIEW = "reviews/createReview";
export const CLEAR_SPOT_REVIEWS = "reviews/clearSpotReviews";
export const DELETE_REVIEW = "review/deleteReview";

// Action creator
export const loadSpotReviews = (reviews) => {
  return {
    type: LOAD_SPOT_REVIEWS,
    reviews,
  };
};

export const createReview = (review) => {
  return {
    type: CREATE_REVIEW,
    review,
  };
};

export const clearSpotReviews = () => {
  return {
    type: CLEAR_SPOT_REVIEWS,
  };
};

export const deleteSpotReview = (reviewId) => {
  return {
    type: DELETE_REVIEW,
    reviewId,
  };
};

// Thunk
export const loadSpotReviewsThunk = (spotId) => async (dispatch) => {
  try {
    // console.log("spotId ------>", spotId);
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

    if (response.ok) {
      const data = await response.json();
      //   console.log("data --->", data);
      dispatch(loadSpotReviews(data));
    }
  } catch (error) {
    console.error(error);
  }
};

export const createReviewThunk =
  (spotId, review, stars) => async (dispatch) => {
    try {
      console.log("spotId ------>", spotId);
      const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ review, stars }),
      });

      if (response.ok) {
        const newRev = await response.json();
        dispatch(loadSpotReviewsThunk(spotId));
        dispatch(createReview(newRev));
      }
    } catch (error) {
      console.error(error);
    }
  };

export const deleteReviewThunk = (reviewId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      dispatch(deleteSpotReview(reviewId));
    }
  } catch (error) {
    console.error(error);
  }
};

// Reducer
const reviewsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_SPOT_REVIEWS: {
      const newState = {};
      //   console.log("action.reviews ------>", action.reviews.Reviews[0]);
      action.reviews.Reviews[0].forEach((review) => {
        // console.log("action.reviews ------>", review);
        newState[review.id] = review;
      });
      return newState;
    }
    case CREATE_REVIEW:
      console.log("action.review ------>", action.review);
      return { ...state, [action.review.id]: action.review };
    case CLEAR_SPOT_REVIEWS:
      const clearedState = {};
      return clearedState;
    case DELETE_REVIEW:
      const newState = { ...state };
      delete newState[action.reviewId];
      return newState;

    default:
      return state;
  }
};

export default reviewsReducer;
