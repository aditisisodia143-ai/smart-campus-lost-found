import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL: API_URL });

// Attach the admin JWT (if present) to every request automatically.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const getItems = (params = {}) => api.get("/items", { params }).then((r) => r.data);

export const getItem = (id) => api.get(`/items/${id}`).then((r) => r.data);

export const getMatches = (id) => api.get(`/items/${id}/matches`).then((r) => r.data);

export const createItem = (formData) =>
  api
    .post("/items", formData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((r) => r.data);

export const updateItemStatus = (id, status) =>
  api.patch(`/items/${id}/status`, { status }).then((r) => r.data);

export const deleteItem = (id) => api.delete(`/items/${id}`).then((r) => r.data);


export const adminLogin = (username, password) =>
  api.post("/auth/login", { username, password }).then((r) => r.data);

export default api;