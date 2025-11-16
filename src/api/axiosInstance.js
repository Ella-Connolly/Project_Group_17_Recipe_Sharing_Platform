// import axios library to make HTTP requests
import axios from "axios";

// create axios instance with API base URL
const api = axios.create({
  // backend base URL (change if needed)
  baseURL: "http://localhost:5000/api",
});

// export axios instance for reusability
export default api;
