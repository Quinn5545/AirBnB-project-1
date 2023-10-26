import React from "react";
import { loadSpotsThunk } from "../../store/spots";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import SpotDetails from "../SpotDetails";
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
                <div className="stars">
                  <i className="fa-solid fa-star"></i>
                  {spot.avgRating}
                </div>
              </div>

              <div className="price-night">
                <div className="price">${spot.price}/night </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
