import axios from "axios";

/* ================= AXIOS INSTANCE ================= */

const API = axios.create({
  baseURL: "http://localhost:9092/restaurant-api/admin"
});

/* ================= TOKEN AUTO-INJECT ================= */

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ================= DASHBOARD ================= */

export const getAdminStats = () => API.get("/stats");
export const getAllRestaurants = () => API.get("/restaurants");

/* ================= KYC ================= */

export const getPendingKyc = () => API.get("/kyc/pending");
export const getKycDetails = (id) => API.get(`/kyc/${id}`);
export const getAudit = (id) => API.get(`/kyc/audit/${id}`);

/* ================= KYC ACTIONS ================= */

export const approveKyc = (id, reason = "") =>
  API.put(`/kyc/approve/${id}`, { reason });

export const holdKyc = (id, reason) =>
  API.put(`/kyc/hold/${id}`, { reason });

export const rejectKyc = (id, reason) =>
  API.put(`/kyc/reject/${id}`, { reason });

export const suspendKyc = (id, reason) =>
  API.put(`/kyc/suspend/${id}`, { reason });

export const reinstateRestaurant = (id) =>
  API.put(`/restaurant/reinstate/${id}`);

export const permanentlyBlockRestaurant = (id, reason) =>
  API.put(`/kyc/block/${id}`, { reason });

/* ================= LIVE CONTROL ================= */

export const goLive = (id) => API.put(`/restaurant/live/${id}`);
export const goOffline = (id) => API.put(`/restaurant/offline/${id}`);

/* ================= ANALYTICS ================= */

export const getCityStats = () => API.get("/stats/cities");
export const getRecentActivity = () => API.get("/activity");


export const getDeliveryAgents = () => API.get("/delivery-agents");
export const approveDeliveryAgent = (id) =>
  API.post(`/delivery-agents/${id}/approve`);
export const blockDeliveryAgent = (id) =>
  API.post(`/delivery-agents/${id}/block`);
