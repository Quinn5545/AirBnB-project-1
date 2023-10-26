import { csrfFetch } from "./csrf";

// exports
export const LOAD_SPOT_REVIEWS = "reviews/loadSpotReviews";

// Action creator
export const loadSpotReviews = (reviews) => {
  return {
    type: LOAD_SPOT_REVIEWS,
    reviews,
  };
};

// Thunk
export const loadSpotReviewsThunk = (spotId) => async (dispatch) => {
  try {
    // console.log("spotId ------>", spotId);
    const response = await fetch(`/api/spots/${spotId}/reviews`);

    if (response.ok) {
      const data = await response.json();
      //   console.log("data --->", data);
      dispatch(loadSpotReviews(data));
    }
  } catch (error) {
    console.error(error);
  }
};

// Reducer
const reviewsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_SPOT_REVIEWS:
      const newState = {};
      //   console.log("action.reviews ------>", action.reviews.Reviews[0]);
      action.reviews.Reviews[0].forEach((review) => {
        // console.log("action.reviews ------>", review);
        newState[review.id] = review;
      });

      return newState;

    default:
      return state;
  }
};

export default reviewsReducer;
