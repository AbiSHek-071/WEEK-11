import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://localhost:3050",
  withCredentials: true,
  timeout: 30000,
});

export default axiosInstance;
