import api from "./axios";

export const createAdmin = async (adminData) => {
  if (!adminData || typeof adminData !== "object") {
    throw new Error("Admin data is required.");
  }

  const response = await api.post("/auth/create-admin", adminData);

  return response.data;
};

export const loginAdmin = async (credentials) => {
  if (!credentials || typeof credentials !== "object") {
    throw new Error("Login credentials are required.");
  }

  const response = await api.post("/auth/login", credentials);

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
