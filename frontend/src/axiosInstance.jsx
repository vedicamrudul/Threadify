// filepath: /Users/vedicamrudul/Desktop/Self projects/Full stack projects/twitter-clone/frontend/src/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // Set your backend base URL here
  withCredentials: true, // Include credentials (cookies) with requests
});

export default axiosInstance;