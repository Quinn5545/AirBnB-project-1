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

  useEffect(() => {
    dispatch(loadSpotsThunk());
  }, [dispatch]);

  return (
    <div>
      <ul className="home-spot-list">
        {spots.map((spot) => (
          <li key={spot.id} className="home-spot-item">
            <Link to={`/spots/${spot.id}`} className="home-spot-link">
              <div className="image-container">
                <img
                  className="home-spot-image"
                  src={spot.previewImage}
                  alt="Spot Image"
                />
                <span className="tooltip">{spot.name}</span>
              </div>
              <div className="home-spot-info">
                <div className="home-cityState">
                  {spot.city}, {spot.state}
                </div>
                <div className="home-stars">
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

              <div className="home-price-night">
                <div className="home-price">${spot.price} night </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
