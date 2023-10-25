import { csrfFetch } from "./csrf";

// exports
export const LOAD_SPOTS = "store/loadSpots";
export const LOAD_SPOT_DETAILS = "store.loadSpotDetails";

// Action creator
export const loadSpots = (spots) => {
  return {
    type: LOAD_SPOTS,
    spots: spots.Spots,
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

// Reducer
const spotsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_SPOTS:
      const newState = {};
      action.spots.forEach((spot) => {
        newState[spot.id] = spot;
      });
      return newState;

    default:
      return state;
  }
};

export default spotsReducer;
