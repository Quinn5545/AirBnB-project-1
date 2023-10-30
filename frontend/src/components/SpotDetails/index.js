import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadSpotDetailsThunk } from "../../store/spots";
import { clearSpotReviews, loadSpotReviewsThunk } from "../../store/reviews";
import { Link, NavLink } from "react-router-dom";
import "./SpotDetails.css";
import CreateReviewModal from "../CreateReviewModal";
import OpenModalButton from "../OpenModalButton/";
import DeleteReviewModal from "../DeleteReviewModal";

export default function SpotDetails() {
  const sessionUser = useSelector((state) => state.session.user);
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spotDetails = useSelector((state) => state.spots[spotId]);
  const reviews = useSelector((state) => Object.values(state.reviews));
  // console.log("review TOP -->", reviews);
  // console.log(sessionUser);
  const rev = reviews.find((review) => review.userId === sessionUser?.id);

  function formatDate(timestamp) {
    const date = new Date(timestamp);

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
    dispatch(clearSpotReviews());
    dispatch(loadSpotDetailsThunk(spotId));
    dispatch(loadSpotReviewsThunk(spotId));
  }, [dispatch, spotId]);

  if (!spotDetails) {
    return null;
  }

  // console.log("spotDetails ------>", spotDetails);

  if (!spotDetails.SpotImages) {
    return null;
  }

  const largeImageUrl = spotDetails.SpotImages[0]
    ? spotDetails.SpotImages[0].url
    : "";
  const smallerImages = spotDetails.SpotImages.slice(1);
  const pTrue = spotDetails.SpotImages.find((img) => img.preview === true);
  const pFalse = spotDetails.SpotImages.filter((img) => !img.preview);

  const sortedReviews = reviews
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  // console.log(sortedReviews);

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
            <img src={pTrue.url} key={largeImageUrl} className="large-image" />
          )}
        </div>
        <div className="smaller-img-box">
          {pFalse.map((img) => (
            <img src={img.url} key={img.id} className="smaller-image" />
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
              {spotDetails.numReviews > 0 ? (
                <>
                  <i className="fa-solid fa-star"></i>
                  {spotDetails.avgStarRating.toFixed(2)} ·{" "}
                  {spotDetails.numReviews === 1
                    ? "1 Review"
                    : `${spotDetails.numReviews} Reviews`}
                </>
              ) : (
                <>
                  <i className="fa-solid fa-star"></i>
                  New
                </>
              )}
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
          {spotDetails.numReviews > 0 ? (
            <>
              <i className="fa-solid fa-star"></i>
              {spotDetails.avgStarRating.toFixed(2)} ·{" "}
              {spotDetails.numReviews === 1
                ? "1 Review"
                : `${spotDetails.numReviews} Reviews`}
            </>
          ) : (
            <>
              <i className="fa-solid fa-star"></i>
              New
            </>
          )}
        </div>

        <div className="add-reviews">
          {sessionUser && sessionUser.id !== spotDetails.ownerId && !rev && (
            <OpenModalButton
              modalComponent={<CreateReviewModal spotId={spotId} />}
              className="add-review"
              buttonText="Post Your Review"
            ></OpenModalButton>
          )}
        </div>
        {sortedReviews.length === 0 &&
        sessionUser &&
        sessionUser.id !== spotDetails.ownerId ? (
          <div className="no-reviews-message">
            Be the first to post a review!
          </div>
        ) : (
          sortedReviews.map((review) => (
            <div key={review.id} className="review">
              <div className="reviewer-name">
                <div className="reviewer-name">{review.User?.firstName}</div>
              </div>
              <div className="stay-month-year">
                {formatDate(review.createdAt)}
              </div>
              <div className="review-text">{review.review}</div>
              <div className="reviewer-name">
                {sessionUser &&
                  (sessionUser.id === review.User?.id ||
                    sessionUser.id === review.userId) && (
                    <div className="delete-review">
                      <OpenModalButton
                        buttonText="Delete"
                        modalComponent={
                          <DeleteReviewModal reviewId={review.id} />
                        }
                      />
                    </div>
                  )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
