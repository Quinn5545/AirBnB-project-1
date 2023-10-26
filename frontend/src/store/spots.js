import { csrfFetch } from "./csrf";

// exports
export const LOAD_SPOTS = "spots/loadSpots";
export const LOAD_SPOT_DETAILS = "spots/loadSpotDetails";

// Action creator
export const loadSpots = (spots) => {
  return {
    type: LOAD_SPOTS,
    spots: spots.Spots,
  };
};

export const loadSpotDetails = (spot) => {
  // console.log(spot);
  return {
    type: LOAD_SPOT_DETAILS,
    spot,
  };
};

// Thunk
export const loadSpotsThunk = (spots) => async (dispatch) => {
  try {
    const response = await fetch("/api/spots");

    if (response.ok) {
      const data = await response.json();
      dispatch(loadSpots(data));
    }
  } catch (error) {
    console.error(error);
  }
};

export const loadSpotDetailsThunk = (spotId) => async (dispatch) => {
  try {
    // console.log("spotId ---->", spotId);
    const response = await fetch(`/api/spots/${spotId}`);
    if (response.ok) {
      const data = await response.json();
      dispatch(loadSpotDetails(data));
    }
  } catch (error) {
    console.error(error);
  }
};

// Reducer
const spotsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_SPOTS:
      const newState = {};
      action.spots.forEach((spot) => {
        newState[spot.id] = spot;
      });
      return newState;
    case LOAD_SPOT_DETAILS:
      // console.log("action.spot", action.spots);
      return { ...state, [action.spot.id]: action.spot };

    default:
      return state;
  }
};

export default spotsReducer;
