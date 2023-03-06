import React from "react";
import axios from "axios";
import { useState } from "react";
import { API_ROUTES, APP_ROUTES } from "../utils/constants";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../lib/customHooks";
import { storeTokenInLocalStorage } from "../lib/common";

const SignIn = () => {
  const navigate = useNavigate();
  const { user, authenticated } = useUser();
  if (user || authenticated) {
    navigate(APP_ROUTES.DASHBOARD);
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const signIn = async () => {
    try {
      const response = await axios({
        method: "post",
        url: API_ROUTES.SIGN_IN,
        data: {
          email: email,
          password: password,
        },
      });

      if (!response?.data?.access_token) {
        console.log("Something went wrong during signing in: ", response);
        return;
      }
      storeTokenInLocalStorage(response.data.access_token);
      navigate(APP_ROUTES.DASHBOARD);
    } catch (err) {
      console.log("Some error occured during signing in: ", err.response.data);
      if (err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError(`
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
          <h3>Sign In</h3>
          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-grid">
            <button type="button" onClick={signIn} className="btn btn-primary">
              Submit
            </button>
          </div>
          <p className="forgot-password text-right">
            Already have an account?{" "}
            <Link to="/signup">
              <span>sign up</span>
            </Link>
          </p>
          <div className="error-red mt-2">{error}</div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
