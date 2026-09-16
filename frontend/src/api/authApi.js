import api from "./axios";

export const loginAdmin = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  return response.data;
};

export const registerAdmin = async (adminData) => {
  const response = await api.post("/auth/register", adminData);

  return response.data;
};

export const getCurrentAdmin = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};

export const logoutAdmin = async () => {
  const response = await api.post("/auth/logout");

  return response.data;
};
