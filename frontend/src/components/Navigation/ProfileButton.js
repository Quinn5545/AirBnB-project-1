import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./ProfileButton.css";
import UserSpots from "../UserSpots";
import { NavLink, useHistory } from "react-router-dom/cjs/react-router-dom.min";

function ProfileButton({ user }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    history.push("/");
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button className="upper-button" onClick={openMenu}>
        <i id="bars" className="fa-solid fa-bars"></i>
        <i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li className="profile-text1">Hello, {user.firstName}</li>

            <li className="profile-text2">{user.email}</li>

            <NavLink className="profile-text3" to="/spots/current">
              Manage Spots
            </NavLink>

            <li className="profile-text4">
              <button className="profile-logout-button" onClick={logout}>
                Log Out
              </button>
            </li>
          </>
        ) : (
          <>
            <div className="chicken">
              {/* <button> */}
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
            </div>
            {/* </button> */}
            <div className="chicken">
              {/* <button> */}
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </div>
            {/* </button> */}
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
