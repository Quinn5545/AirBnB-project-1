import { csrfFetch } from "./csrf";

// exports
export const LOAD_SPOTS = "spots/loadSpots";
export const LOAD_SPOT_DETAILS = "spots/loadSpotDetails";
export const CREATE_SPOT = "spots/createSpot";

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

export const createSpot = (spot) => {
  return {
    type: CREATE_SPOT,
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

export const createSpotThunk = (spotData) => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/spots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(spotData),
    });
    console.log("response ----->", response);

    if (response.ok) {
      const data = await response.json();
      dispatch(createSpot(data));
      return data;
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

    case CREATE_SPOT:
      return { ...state, [action.spot.id]: action.spot };
    default:
      return state;
  }
};

export default spotsReducer;
