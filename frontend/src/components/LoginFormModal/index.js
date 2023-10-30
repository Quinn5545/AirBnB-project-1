import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          setErrors(data);
        }
      });
  };

  const loginDemo = () => {
    setCredential("Demo-lition");
    setPassword("password0");
  };

  const isLoginButtonDisabled = credential.length < 4 || password.length < 6;

  return (
    <>
      <div className="login-box">
        <h1 className="title">Log In</h1>
        {errors.message && <p>{errors.message}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            <input
              className="username"
              placeholder="Username or Email"
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
          </label>
          <label>
            <input
              className="password"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button
            className={`login-button ${
              isLoginButtonDisabled ? "disabled" : ""
            }`}
            type="submit"
            disabled={isLoginButtonDisabled}
          >
            Log In
          </button>
          <div className="demo">
            <button to="#" onClick={loginDemo}>
              Demo User
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default LoginFormModal;
