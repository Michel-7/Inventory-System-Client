import React from "react";
import axios from "axios";
import { useState } from "react";
import { API_ROUTES, APP_ROUTES } from "../utils/constants";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");

  const signUp = async () => {
    try {
      const response = await axios({
        method: "POST",
        url: API_ROUTES.SIGN_UP,
        data: {
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        },
      });
      console.log(response);
      if (!response?.data?.user) {
        console.log("Something went wrong during signing up: ", response);
        return;
      }
      navigate(APP_ROUTES.SIGN_IN);
    } catch (err) {
      console.log("Some error occured during signing up: ", err.response.data);
      if (err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError(`
        ${err.response.data.name ? err.response.data.name : ""}\n
        ${err.response.data.email ? err.response.data.email : ""}\n
         ${err.response.data.password ? err.response.data.password : ""}
        `);
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form>
          <h3>Sign Up</h3>
          <div className="mb-3">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="re-enter your password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </div>
          <div className="d-grid">
            <button type="button" onClick={signUp} className="btn btn-primary">
              Sign Up
            </button>
          </div>
          <p className="forgot-password text-right">
            Already registered{" "}
            <Link to="/signin">
              <span>sign in</span>
            </Link>
          </p>
          <div className="error-red mt-2">{error}</div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
