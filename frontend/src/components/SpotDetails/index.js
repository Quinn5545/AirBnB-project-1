import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadSpotDetailsThunk } from "../../store/spots";
import { loadSpotReviewsThunk } from "../../store/reviews";
import { Link, NavLink } from "react-router-dom";
import "./SpotDetails.css";

export default function SpotDetails() {
  const sessionUser = useSelector((state) => state.session.user);
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spotDetails = useSelector((state) => state.spots[spotId]);
  const reviews = useSelector((state) => Object.values(state.reviews));
  // console.log("review TOP -->", reviews);
  // console.log(sessionUser);

  function formatDate(timestamp) {
    const date = new Date(timestamp);

    // Define month names
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const year = date.getFullYear();
    const month = monthNames[date.getMonth()];

    return `${month} ${year}`;
  }

  useEffect(() => {
    dispatch(loadSpotDetailsThunk(spotId));
    dispatch(loadSpotReviewsThunk(spotId));
  }, [dispatch, spotId]);

  if (!spotDetails) {
    return <div>Loading...</div>;
  }

  //   console.log("spotDetails ------>", spotDetails);

  if (!spotDetails.SpotImages) {
    return <div>Images Loading</div>;
  }

  const largeImageUrl = spotDetails.SpotImages[0]
    ? spotDetails.SpotImages[0].url
    : "";
  const smallerImages = spotDetails.SpotImages.slice(1);

  return (
    <div>
      <div className="nameCity-box">
        <div className="spotName">{spotDetails.name}</div>
        <div className="spotCity">
          {spotDetails.city}, {spotDetails.state}, {spotDetails.country}
        </div>
      </div>

      <div className="image-box">
        <div className="large-img-box">
          {largeImageUrl && (
            <img
              src={largeImageUrl}
              key={largeImageUrl}
              className="large-image"
            />
          )}
        </div>
        <div className="smaller-img-box">
          {smallerImages.map((image) => (
            <img src={image.url} key={image.id} className="smaller-image" />
          ))}
        </div>
      </div>

      <div className="description-box">
        <div className="host">
          Hosted by {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}
          <div className="description">{spotDetails.description}</div>
        </div>
        <div className="price-star-reserve-box">
          <div className="price-star">
            <div className="price">
              <div className="dollars">${spotDetails.price}</div>
              <div className="night">night</div>
            </div>
            <div className="stars">
              <i className="fa-solid fa-star"></i>
              {spotDetails.avgStarRating} • {spotDetails.numReviews} reviews
            </div>
          </div>
          <div className="reserve-button">
            <a
              href="#"
              onClick={() => {
                alert("Feature Coming Soon...");
              }}
            >
              Reserve
            </a>
          </div>
        </div>
      </div>

      <div className="line-bar"></div>

      <div className="review-box">
        <div className="rev-stars">
          <i className="fa-solid fa-star"></i>
          {spotDetails.avgStarRating} • {spotDetails.numReviews} reviews
        </div>
        <div className="add-reviews">
          {sessionUser && (
            <NavLink to={`#`} className="add-review">
              Create a Review
            </NavLink>
          )}
        </div>
        {reviews.map((review) => (
          <div key={review.id} className="review">
            <div className="reviewer-name">{review.User.firstName}</div>
            <div className="stay-month-year">
              {formatDate(review.createdAt)}
            </div>
            <div className="review-text">{review.review}</div>
            {sessionUser && sessionUser.id === review.User.id && (
              <NavLink to={`#`} className="delete-review">
                Delete Review
              </NavLink>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
