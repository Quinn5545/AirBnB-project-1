import { csrfFetch } from "./csrf";

// exports
export const LOAD_SPOTS = "spots/loadSpots";
export const LOAD_SPOT_DETAILS = "spots/loadSpotDetails";
export const CREATE_SPOT = "spots/createSpot";
export const CREATE_IMAGE = "spots/createImage";
export const UPDATE_SPOT = "spots/updateSpot";
export const DELETE_SPOT = "spots/deleteSpot";
// Action creator
export const loadSpots = (spots) => {
  return {
    type: LOAD_SPOTS,
    // spots: spots.Spots,
    spots,
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

export const createImage = (image) => {
  return {
    type: CREATE_IMAGE,
    image,
  };
};

export const updateSpot = (spot) => {
  return {
    type: UPDATE_SPOT,
    spot,
  };
};

export const deleteSpot = (spotId) => {
  return {
    type: DELETE_SPOT,
    spotId,
  };
};

// Thunk
export const loadSpotsThunk = (spots) => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/spots");

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
    const response = await csrfFetch(`/api/spots/${spotId}`);
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
    // console.log("response ----->", response);

    if (response.ok) {
      const data = await response.json();
      dispatch(createSpot(data));
      return data;
    }
  } catch (error) {
    console.error(error);
  }
};

export const createImageThunk = (spotId, url, preview) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, preview }),
    });

    if (response.ok) {
      const newImg = await response.json();
      dispatch(createImage(newImg));
    }
  } catch (error) {
    console.error(error);
  }
};

export const updateSpotThunk = (spotId, dataObj) => async (dispatch) => {
  try {
    // console.log("spotId", spotId);
    // console.log("dataObj", dataObj);
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataObj),
    });

    if (response.ok) {
      const updatedSpot = await response.json();
      dispatch(updateSpot(updatedSpot));
      return updateSpot;
    }
  } catch (error) {
    console.error(error);
  }
};

export const deleteSpotThunk = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "DELETE",
    });
    // console.log("hi");
    if ((await response).status < 400) {
      // console.log("hello");
      const data = await response.json();
      await dispatch(deleteSpot(spotId));
      await dispatch(loadSpots());
      return data;
    }
  } catch (error) {
    console.error(error);
  }
};

// Reducer
const spotsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_SPOTS: {
      const newState = {};
      action.spots.Spots.forEach((spot) => {
        newState[spot.id] = spot;
      });
      return newState;
    }
    case LOAD_SPOT_DETAILS:
      // console.log("action.spot", action.spots);
      return { ...state, [action.spot.id]: action.spot };
    case UPDATE_SPOT:
      return { ...state, [action.spot.id]: action.spot };
    case CREATE_SPOT:
      return { ...state, [action.spot.id]: action.spot };
    case DELETE_SPOT:
      const newState = { ...state };
      // console.log(freshState.ownedSpots);
      delete newState[action.spotId];
      return newState;

    default:
      return state;
  }
};

export default spotsReducer;
