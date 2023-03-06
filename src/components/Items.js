import React, { useEffect, useState } from "react";
import Icon from "react-crud-icons";
import "../assets/css/crud-icons.css";
import { Link, useNavigate, useParams } from "react-router-dom";
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

const Items = () => {
  const navigate = useNavigate();
  const { user, authenticated } = useUser();
  const { typeId } = useParams();
  const [items, setItems] = useState([]);
  const [itemToEdit, setItemToEdit] = useState();
  const [name, setName] = useState();
  const [sold, setSold] = useState(false);
  const [serial, setSerial] = useState();
  const [bulkItems, setBulkItems] = useState();
  const token = getTokenFromLocalStorage();

  const [editModalShow, setEditModalShow] = useState(false);
  const handleEditShow = () => setEditModalShow(true);
  const handleEditClose = () => {
    setName("");
    setSerial("");
    setError("");
    setEditModalShow(false);
  };

  const [addModalShow, setAddModalShow] = useState(false);
  const handleAddShow = () => setAddModalShow(true);
  const handleAddClose = () => {
    setName("");
    setSerial("");
    setError("");
    setAddModalShow(false);
  };

  const [error, setError] = useState("");

  const [bulkShow, setBulkShow] = useState(false);
  const handleBulkShow = () => {
    handleAddClose();
    setBulkShow(true);
  };
  const handleBulkClose = () => {
    setSerial("");
    setError("");
    setBulkShow(false);
  };

  const [searchTerm, setSearchTerm] = useState();

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const getItems = async () => {
    try {
      const url = `${API_ROUTES.GET_ITEMS}/${typeId}`;
      const response = await axios.get(url, config);
      if (!response?.data?.data) {
        console.log("Something went wrong while getting the items", response);
        return;
      }
      setItems(response.data.data);
    } catch (err) {
      console.log(err.response.data);
    }
  };

  const handleModalSubmit = async (action) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("serial_number", serial);
      let url = "";
      if (action == "add") {
        url = API_ROUTES.ADD_ITEM;
        formData.append("products_type_id", typeId);
      } else {
        url = `${API_ROUTES.UPDATE_ITEM}/${itemToEdit}?_method=put`;
      }
      const response = await axios.post(url, formData, config);
      if (!response?.data?.data) {
        console.log(
          "Something went wrong in adding or editing the item: ",
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
      getItems();
    } catch (err) {
      console.log(err.response.data);
      setError("Wrong or missing fields");
    }
  };

  const deleteType = async (id) => {
    try {
      const response = await axios.delete(
        `${API_ROUTES.DELETE_ITEM}/${id}`,
        config
      );
      if (!response.data.data) {
        console.log(
          "Something went wrong during the deletion of this product: ",
          response
        );
        return;
      }
      const newItems = items.filter((item) => item.id !== id);
      setItems(newItems);
    } catch (err) {
      console.log(
        "Something went wrong during the deletion of this product: ",
        err.response.data
      );
    }
  };

  const handleCheck = async (id) => {
    try {
      const response = await axios.post(
        `${API_ROUTES.SOLD_ITEM}/${id}`,
        null,
        config
      );
      if (!response.data.data) {
        console.log("Something went wrong : ", response);
        return;
      }
      getItems();
    } catch (err) {
      console.log("Something went wrong  ", err.response.data);
    }
  };

  const handleBulkAdd = async () => {
    try {
      let items = bulkItems.split(" ");
      let data = [];

      for (let i = 0; i < items.length; i++) {
        data.push({
          name: "bulk inserted",
          serial_number: items[i],
          products_type_id: typeId,
        });
      }

      const response = await axios.post(
        `${API_ROUTES.BULK_ADD_ITEMS}`,
        { items: data },
        config
      );
      if (!response.data.data) {
        console.log("Something went wrong : ", response);
        setError("Wrong or missing fields");
        return;
      }
      handleBulkClose();
      getItems();
    } catch (err) {
      console.log(err.response);
      setError("Wrong or missing fields");
    }
  };

  const handleEditClick = (id) => {
    setItemToEdit(id);
    handleEditShow();
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    if (searchTerm == "") getItems();
    const newItems = items.filter((item) =>
      item.serial_number.includes(searchTerm)
    );
    setItems(newItems);
  };

  useEffect(() => {
    getItems();
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
      <Link to="/dashboard">
        <div className="backBtn mx-3 py-2">
          <Icon name="arrow-left" theme="dark" size="small" />
          <span className="">Back to Product Types</span>
        </div>
      </Link>
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
            <th scope="col">Serial Number</th>
            <th scope="col">Tools</th>
            <th scope="col">Sold</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="table-secondary">
              <th scope="row">{item.id}</th>
              <td>{item.name}</td>
              <td>{item.serial_number}</td>
              <td>
                <Icon
                  className="me-1"
                  name="edit"
                  tooltip="Edit"
                  theme="light"
                  size="small"
                  onClick={() => handleEditClick(item.id)}
                />
                <Icon
                  name="delete"
                  tooltip="Delete"
                  theme="light"
                  size="small"
                  onClick={() => deleteType(item.id)}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={item.sold == "1" ? true : false}
                  onChange={(e) => handleCheck(item.id)}
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
          <Modal.Title>Edit Item </Modal.Title>
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
              <Form.Label>Serial Number</Form.Label>
              <Form.Control
                type="text"
                value={serial ? serial : ""}
                onChange={(e) => setSerial(e.target.value)}
              />
            </Form.Group>
            <div className="error-red mt-2">{error}</div>
          </Form>
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
          <Modal.Title>Add a new Item </Modal.Title>
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
              <Form.Label>Serial Number</Form.Label>
              <Form.Control
                type="text"
                value={serial ? serial : ""}
                onChange={(e) => setSerial(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleBulkShow}>
              Bulk Insert
            </Button>
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

      <Modal centered show={bulkShow} onHide={handleBulkClose}>
        {/*Add product modal*/}
        <Modal.Header closeButton>
          <Modal.Title>
            Add multiple serial numbers seperated by spaces{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Control
                type="text"
                value={bulkItems ? bulkItems : ""}
                onChange={(e) => setBulkItems(e.target.value)}
              />
            </Form.Group>
            <div className="error-red mt-2">{error}</div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleBulkClose}>
            Close
          </Button>
          <Button variant="primary" type="button" onClick={handleBulkAdd}>
            Bulk Insert
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Items;
