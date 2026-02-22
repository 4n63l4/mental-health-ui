import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://act-1-x553.onrender.com', // ← your live Render URL
});
