import React, { useState } from "react";
import { loadSpotsThunk, updateSpotThunk } from "../../store/spots";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import OpenModalButton from "../OpenModalButton";
import DeleteSpotModal from "../DeleteSpotModal";
import "./UserSpots.css";

export default function UserSpots() {
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);
  const spots = useSelector((state) => Object.values(state.spots));
  const dispatch = useDispatch();

  const ownedSpots = spots.filter((spot) => {
    return spot.ownerId === sessionUser.id;
  });

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [img1, setImg1] = useState("");
  const [img2, setImg2] = useState("");
  const [img3, setImg3] = useState("");
  const [img4, setImg4] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    // error checkers
    if (!country) newErrors.country = "Country is required";
    if (!address) newErrors.address = "Address is required";
    if (!city) newErrors.city = "City is required";
    if (!state) newErrors.state = "State is required";
    if (latitude < -180 || latitude > 180 || !latitude) {
      newErrors.latitude =
        "Latitude must lower than 180 and higher than -180, and not 0";
    }
    if (longitude < -180 || longitude > 180 || !longitude) {
      newErrors.longitude =
        "Longitude must lower than 180 and higher than -180, and not 0";
    }
    if (description.length < 30) {
      newErrors.description = "Description needs a minimum of 30 characters";
    }
    if (!name) newErrors.name = "Name is required";
    if (!price || price < 0) newErrors.price = "Price is required";
    if (!previewImage) newErrors.previewImage = "Preview image is required";
    if (
      !img1.endsWith(".jpg") &&
      !img1.endsWith(".png") &&
      !img1.endsWith(".jpeg") &&
      !img2.endsWith(".jpg") &&
      !img2.endsWith(".png") &&
      !img2.endsWith(".jpeg") &&
      !img3.endsWith(".jpg") &&
      !img3.endsWith(".png") &&
      !img3.endsWith(".jpeg") &&
      !img4.endsWith(".jpg") &&
      !img4.endsWith(".png") &&
      !img4.endsWith(".jpeg")
    ) {
      newErrors.img1 = "Image URL must end in .png, .jpg, or .jpeg";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      const dataObj = {
        name,
        address,
        city,
        latitude,
        longitude,
        state,
        country,
        description,
        price,
        // previewImage,
        // img1,
        // img2,
        // img3,
        // img4,
      };

      console.log("Spot data to be submitted:", dataObj);

      const res = await dispatch(updateSpotThunk(dataObj));
      const newSpot = res;

      history.push(`/spots/${newSpot.id}`);
    }
  };

  useEffect(() => {
    dispatch(loadSpotsThunk());
  }, [dispatch]);

  return (
    <div>
      <div className="top-box">
        <div className="manage-title">Manage Spots</div>
        <div className="create">
          {sessionUser && (
            <NavLink className="new-spot-button" to="/spots/new">
              Create a New Spot
            </NavLink>
          )}
        </div>
      </div>
      <ul className="spot-list">
        {ownedSpots.map((spot) => (
          <li key={spot.id} className="spot-item">
            <Link to={`/spots/${spot.id}`} className="spot-link">
              <div className="tooltip">{spot.name}</div>
              <img
                className="spot-image"
                src={spot.previewImage}
                alt="Spot Image"
              />
              <div className="spot-info">
                <div className="cityState">
                  {spot.city}, {spot.state}
                </div>
                <div className="user-spot-stars">
                  {spot.avgRating > 0 ? (
                    <>
                      <i className="fa-solid fa-star"></i>
                      {spot.avgRating.toFixed(2)}
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-star"></i>
                      New
                    </>
                  )}
                </div>
              </div>

              <div className="price-night">
                <div className="price">${spot.price}/night </div>
              </div>
            </Link>
            <div className="button-box">
              <Link className="update-link" to={`/spots/${spot.id}/edit`}>
                <button className="update-button">Update</button>
              </Link>
              <div className="delete-modal">
                <OpenModalButton
                  buttonText="Delete"
                  modalComponent={<DeleteSpotModal spotId={spot.id} />}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
