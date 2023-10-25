import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    // <ul>
    //   <NavLink exact to="/">
    //     <img
    //       className="logo"
    //       src="https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3BmLWFrZTY5NDgtbnVtLWppdGUtOC1qb2I3ODcucG5n.png"
    //     ></img>
    //     TennisBnB
    //   </NavLink>
    //   <i class="fa-solid fa-bars"></i>
    //   {isLoaded && <ProfileButton user={sessionUser} />}
    // </ul>
    <div>
      <div className="nav-bar">
        <div className="logo-box">
          <NavLink exact to="/" className="navLink">
            <img
              className="logo"
              src="https://t3.ftcdn.net/jpg/05/75/66/22/360_F_575662250_cU1ZPChr8ejd7QKT4nN77RhBCtQ7SaLJ.jpg"
            />
            TennisBnB
          </NavLink>
        </div>

        {/* <div className="newSpot-box">
          <div>create new spot</div>
        </div> */}

        <div className="user-box">
          {sessionUser && (
            <NavLink className="new-spot" to="/spots">
              Create a New Spot
            </NavLink>
          )}
          <div className="profile-box">
            {isLoaded && <ProfileButton user={sessionUser} />}
          </div>
        </div>
      </div>

      <div className="line-bar"></div>
    </div>
  );
}

export default Navigation;
