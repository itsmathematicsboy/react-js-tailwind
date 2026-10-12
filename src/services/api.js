import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-type": "Application/json",
    Accept: "Application/json",
  },
});

export default api;
