import React from "react";
import { loadSpotsThunk } from "../../store/spots";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import "./homePage.css";

export default function HomePage() {
  const spots = useSelector((state) => Object.values(state.spots));
  const dispatch = useDispatch();
  //   console.log("spots", spots);

  useEffect(() => {
    dispatch(loadSpotsThunk());
  }, [dispatch]);

  return (
    <div>
      <ul className="spot-list">
        {spots.map((spot) => (
          <li key={spot.id} className="spot-item">
            <img
              className="spot-image"
              src={spot.previewImage}
              alt="Spot Image"
            />
            <div className="spot-info">
              <p className="cityState">
                {spot.city}, {spot.state}
              </p>
              <p className="price">${spot.price}/night </p>
              <p className="stars">
                <i className="fa-solid fa-star"></i>
                {spot.avgRating}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
