const API_URL = "http://127.0.0.1:8000/api";

export const API_ROUTES = {
  SIGN_UP: `${API_URL}/auth/register`,
  SIGN_IN: `${API_URL}/auth/login`,
  SIGN_OUT: `${API_URL}/auth/logout`,
  GET_USER: `${API_URL}/auth/user-profile`,
  GET_PRODUCT_TYPES: `${API_URL}/productTypes`,
  DELETE_PRODUCT_TYPE: `${API_URL}/productType`,
  UPDATE_PRODUCT_TYPE: `${API_URL}/productType`,
  ADD_PRODUCT_TYPE: `${API_URL}/productType`,
  GET_ITEMS: `${API_URL}/items`,
  UPDATE_ITEM: `${API_URL}/item`,
  ADD_ITEM: `${API_URL}/item`,
  DELETE_ITEM: `${API_URL}/item`,
  SOLD_ITEM: `${API_URL}/item`,
  BULK_ADD_ITEMS: `${API_URL}/items`,
};

export const APP_ROUTES = {
  SIGN_UP: "/signup",
  SIGN_IN: "/signin",
  DASHBOARD: "/dashboard",
  ITEMS: "/items",
};
