import api from "./axios";

export const getSiteSettings = async () => {
  const response = await api.get("/site-settings");
  return response.data;
};

export const createSiteSettings = async (settingsData) => {
  const response = await api.post("/site-settings", settingsData);
  return response.data;
};

export const updateSiteSettings = async (settingsData) => {
  const response = await api.patch("/site-settings", settingsData);
  return response.data;
};

export const deleteSiteSettings = async () => {
  const response = await api.delete("/site-settings");
  return response.data;
};
