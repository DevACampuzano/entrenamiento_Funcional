import axios from "axios";

const api = axios.create({
  baseURL: "https://d4rj085x-10573.use2.devtunnels.ms/api/",
});

export default api;
