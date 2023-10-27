import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
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

        <div className="user-box">
          {sessionUser && (
            <NavLink className="new-spot" to="/spots/new">
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
