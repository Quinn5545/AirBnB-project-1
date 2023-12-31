import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createImageThunk, createSpotThunk } from "../../store/spots";
import "./CreateNewSpot.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function CreateNewSpot() {
  const history = useHistory();
  const dispatch = useDispatch();

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
    if (latitude < -180 || latitude > 180) {
      newErrors.latitude = "Latitude must lower than 180 and higher than -180";
    }
    if (longitude < -180 || longitude > 180) {
      newErrors.longitude =
        "Longitude must lower than 180 and higher than -180";
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
        previewImage,
        img1,
        img2,
        img3,
        img4,
      };

      console.log("Spot data to be submitted:", dataObj);

      const res = await dispatch(createSpotThunk(dataObj));

      await dispatch(createImageThunk(res.id, previewImage, true));

      await dispatch(createImageThunk(res.id, img1, false));
      await dispatch(createImageThunk(res.id, img2, false));
      await dispatch(createImageThunk(res.id, img3, false));
      await dispatch(createImageThunk(res.id, img4, false));

      // console.log("res ------>", res);
      history.push(`/spots/${res.id}`);
    }
  };

  return (
    <div className="create-new-spot">
      <form onSubmit={handleSubmit} className="form-box">
        <div className="top-tips1">
          <div className="title1">Create a new Spot</div>
          <div className="title2">Where's your place located?</div>
          <div className="title3">
            Guests will only get your exact address once they booked a
            reservation.
          </div>
        </div>
        <div className="box1">
          <label className="country">
            Country
            {errors.country && (
              <div className="error-message">{errors.country}</div>
            )}
            <input
              placeholder="Country"
              type="text"
              name="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              //   required
            />
          </label>
          <label className="address">
            Street Address
            {errors.address && (
              <div className="error-message">{errors.address}</div>
            )}
            <input
              placeholder="Address"
              type="text"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>
          <div className="city-state-box">
            <label>
              City
              {errors.city && (
                <div className="error-message">{errors.city}</div>
              )}
              <input
                placeholder="City"
                type="text"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                // required
                className="city"
              />
            </label>
            <label>
              State
              {errors.state && (
                <div className="error-message">{errors.state}</div>
              )}
              <input
                placeholder="STATE"
                type="text"
                name="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                // required
                className="state"
              />
            </label>
          </div>
          <div className="lat-lng-box">
            <label>
              Latitude
              {errors.latitude && (
                <div className="error-message">{errors.latitude}</div>
              )}
              <input
                placeholder="Latitude"
                type="number"
                name="latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </label>
            <label>
              Longitude
              {errors.longitude && (
                <div className="error-message">{errors.longitude}</div>
              )}
              <input
                placeholder="Longitude"
                type="number"
                name="longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </label>
          </div>
          <div className="line-bar"></div>
        </div>

        <div className="box2">
          <div className="title21">Describe your place to guests</div>
          <div className="title22">
            Mention the best features of your space, any special amenities like
            fast wifi or parking, and what you love about the neighborhood.
          </div>

          <div className="desc-box">
            <label className="desc-label">
              <textarea
                placeholder="Please write at least 30 characters"
                className="desc-area"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                // required
              />
              {errors.description && (
                <div className="error-message">{errors.description}</div>
              )}
            </label>
          </div>
          <div className="line-bar"></div>
        </div>

        <div className="box3">
          <div className="title31">Create a title for your spot</div>
          <div className="title32">
            Catch guests' attention with a spot title that highlights what makes
            your place special.
          </div>

          <div className="name-box">
            <label className="name">
              <input
                placeholder="Name of your spot"
                className="name-input"
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                // required
              />
              {errors.name && (
                <div className="error-message">{errors.name}</div>
              )}
            </label>
          </div>
          <div className="line-bar"></div>
        </div>

        <div className="box4">
          <div className="title41">Set a base price for your spot</div>
          <div className="title42">
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </div>

          <div className="price-box">
            <div className="currency-symbol">$</div>
            <label className="price">
              <input
                placeholder="Price per night (USD)"
                className="price-input"
                type="number"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                // required
              />
              {errors.price && (
                <div className="error-message">{errors.price}</div>
              )}
            </label>
          </div>
          <div className="line-bar"></div>
        </div>

        <div className="box5">
          <div className="title51">Liven up your spot with photos</div>
          <div className="title52">
            Submit a link to at least one photo to publish your spot.
          </div>
          <div className="img-box">
            <label className="prev-image">
              <input
                placeholder="Preview Image URL"
                type="text"
                name="previewImgUrl"
                value={previewImage}
                onChange={(e) => setPreviewImage(e.target.value)}
              />
              {errors.previewImage && (
                <div className="error-message">{errors.previewImage}</div>
              )}
            </label>
            <label className="image">
              <input
                className="image1-url"
                placeholder="Image URL"
                type="text"
                name="img1"
                value={img1}
                onChange={(e) => setImg1(e.target.value)}
              />
              {errors.img1 && (
                <div className="error-message">{errors.img1}</div>
              )}
            </label>
            <label className="image">
              <input
                className="image-url"
                placeholder="Image URL"
                type="text"
                name="img2"
                value={img2}
                onChange={(e) => setImg2(e.target.value)}
              />
              {errors.img2 && (
                <div className="error-message">{errors.img2}</div>
              )}
            </label>
            <label className="image">
              <input
                className="image-url"
                placeholder="Image URL"
                type="text"
                name="img3"
                value={img3}
                onChange={(e) => setImg3(e.target.value)}
              />
              {errors.img3 && (
                <div className="error-message">{errors.img3}</div>
              )}
            </label>
            <label className="image">
              <input
                className="image-url"
                placeholder="Image URL"
                type="text"
                name="img4"
                value={img4}
                onChange={(e) => setImg4(e.target.value)}
              />
              {errors.img4 && (
                <div className="error-message">{errors.img4}</div>
              )}
            </label>
          </div>
          <div className="line-bar"></div>
        </div>

        <button type="submit" className="submit-button">
          Create Spot
        </button>
      </form>
    </div>
  );
}
