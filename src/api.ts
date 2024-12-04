import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.34:10573/api/",
});

export default api;
