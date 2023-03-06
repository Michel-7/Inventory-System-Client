import React from "react";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { API_ROUTES, APP_ROUTES } from "../utils/constants";

const Nav = ({ name, config }) => {
  const navigate = useNavigate();
  const signOut = async () => {
    try {
      const response = await axios.post(API_ROUTES.SIGN_OUT, null, config);
      if (!response?.data) {
        console.log("Something went wrong while signing out: ", response);
        return;
      }
      navigate(APP_ROUTES.SIGN_IN);
    } catch (err) {
      console.log(err.response.data);
    }
  };

  return (
    <Navbar sticky="top" bg="light">
      <Container>
        <Navbar.Brand>Inventory System</Navbar.Brand>
        <div className="d-flex align-items-center">
          <span className="me-4">Welcome, {name}</span>
          <Button variant="primary" type="button" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </Container>
    </Navbar>
  );
};

export default Nav;
