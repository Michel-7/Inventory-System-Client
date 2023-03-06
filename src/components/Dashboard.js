import React, { useEffect, useState } from "react";
import Icon from "react-crud-icons";
import "../assets/css/crud-icons.css";
import { Link, useNavigate } from "react-router-dom";
import { API_ROUTES, APP_ROUTES } from "../utils/constants";
import { useUser } from "../lib/customHooks";
import { getTokenFromLocalStorage } from "../lib/common";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Container,
} from "react-bootstrap";
import Nav from "./Nav";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, authenticated } = useUser();
  const token = getTokenFromLocalStorage();
  const [productTypes, setProductTypes] = useState([]);

  const [itemToEdit, setItemToEdit] = useState();
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [image, setImage] = useState(null);

  const [searchTerm, setSearchTerm] = useState();

  const [error, setError] = useState("");

  const [editModalShow, setEditModalShow] = useState(false);
  const handleEditShow = () => setEditModalShow(true);
  const handleEditClose = () => {
    setName("");
    setDescription("");
    setError("");
    setEditModalShow(false);
  };

  const [addModalShow, setAddModalShow] = useState(false);
  const handleAddShow = () => setAddModalShow(true);
  const handleAddClose = () => {
    setName("");
    setDescription("");
    setError("");
    setAddModalShow(false);
  };

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const getProductTypes = async () => {
    try {
      const response = await axios.get(API_ROUTES.GET_PRODUCT_TYPES, config);
      if (!response.data.data) {
        console.log(
          "Something went wrong during getting the productTypes: ",
          response
        );
        return;
      }
      setProductTypes(response.data.data);
    } catch (err) {
      console.log(
        "Some error occured during getting the productTypes: ",
        err.response.data
      );
    }
  };

  const deleteType = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await axios.delete(
        `${API_ROUTES.DELETE_PRODUCT_TYPE}/${id}`,
        config
      );
      if (!response.data.data) {
        console.log(
          "Something went wrong during the deletion of this product: ",
          response
        );
        return;
      }
      const newProductsType = productTypes.filter(
        (productType) => productType.id !== id
      );
      setProductTypes(newProductsType);
    } catch (err) {
      console.log(
        "Something went wrong during the deletion of this product: ",
        err.response.data
      );
    }
  };

  const handleModalSubmit = async (action) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("image", image);
      let url = "";
      if (action == "add") {
        url = API_ROUTES.ADD_PRODUCT_TYPE;
      } else {
        url = `${API_ROUTES.UPDATE_PRODUCT_TYPE}/${itemToEdit}?_method=put`;
      }
      const response = await axios.post(url, formData, config);
      if (!response?.data?.data) {
        console.log(
          "Something went wrong in adding or editing the type: ",
          response
        );
        setError("Wrong or missing fields");
        return;
      }
      if (action == "add") {
        handleAddClose();
      } else {
        handleEditClose();
      }
      getProductTypes();
    } catch (err) {
      console.log("this: ", err.response.data);
      setError("Wrong or missing fields");
    }
  };

  const handleFileSelect = (event) => {
    console.log(event.target.files[0]);
    setImage(event.target.files[0]);
  };
  const handleEditClick = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setItemToEdit(id);
    handleEditShow();
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    if (searchTerm == "") getProductTypes();
    const newProductTypes = productTypes.filter((productType) =>
      productType.name.includes(searchTerm)
    );
    setProductTypes(newProductTypes);
  };

  const handleRowClick = (id) => {
    navigate(`${APP_ROUTES.ITEMS}/${id}`);
  };

  useEffect(() => {
    getProductTypes();
  }, []);

  if (!user || !authenticated) {
    return (
      <div className="d-flex w-100 h-100 justify-content-center align-items-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Nav name={user.name} config={config} />
      <Container>
        <Form.Group className="my-3" controlId="formBasicDescription">
          <Form.Control
            type="text"
            value={searchTerm ? searchTerm : ""}
            placeholder="Search..."
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Form.Group>
      </Container>
      <table className="table table-hover">
        <thead>
          <tr className="table-primary">
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Image</th>
            <th scope="col">Count</th>
            <th scope="col">Tools</th>
          </tr>
        </thead>
        <tbody>
          {productTypes.map((productType) => (
            <tr
              onClick={() => handleRowClick(productType.id)}
              key={productType.id}
              className="table-secondary"
            >
              <th scope="row">{productType.id}</th>
              <td>{productType.name}</td>
              <td>
                <img className="typeImage" src={productType.image} />
              </td>
              <td>{productType.count}</td>
              <td>
                <Icon
                  className="me-1"
                  name="edit"
                  tooltip="Edit"
                  theme="light"
                  size="small"
                  onClick={(e) => handleEditClick(e, productType.id)}
                />
                <Icon
                  name="delete"
                  tooltip="Delete"
                  theme="light"
                  size="small"
                  onClick={(e) => deleteType(e, productType.id)}
                />
              </td>
            </tr>
          ))}
          <tr className="table-secondary">
            <td colSpan={5}>
              <Button variant="primary" type="button" onClick={handleAddShow}>
                Add
              </Button>
            </td>
          </tr>
        </tbody>
      </table>

      <Modal centered show={editModalShow} onHide={handleEditClose}>
        {/*edit product modal*/}
        <Modal.Header closeButton>
          <Modal.Title>Edit Product Type </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name ? name : ""}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicDescription">
              <Form.Label>description</Form.Label>
              <Form.Control
                type="text"
                value={description ? description : ""}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicImage">
              <Form.Label>Upload an image</Form.Label>
              <Form.Control type="file" onChange={handleFileSelect} />
            </Form.Group>
          </Form>
          <div className="error-red mt-2">{error}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditClose}>
            Close
          </Button>
          <Button variant="primary" type="button" onClick={handleModalSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal centered show={addModalShow} onHide={handleAddClose}>
        {/*Add product modal*/}
        <Modal.Header closeButton>
          <Modal.Title>Add a new Product Type </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name ? name : ""}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicDescription">
              <Form.Label>description</Form.Label>
              <Form.Control
                type="text"
                value={description ? description : ""}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicImage">
              <Form.Label>Upload an image</Form.Label>
              <Form.Control type="file" onChange={handleFileSelect} />
            </Form.Group>
            <div className="error-red mt-2">{error}</div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAddClose}>
            Close
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={() => handleModalSubmit("add")}
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Dashboard;
