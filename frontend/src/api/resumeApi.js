import api from "./axios";

export const getResume = async () => {
  const response = await api.get("/resume");

  return response.data;
};

export const uploadResume = async ({ file, title = "Resume" }) => {
  const formData = new FormData();

  formData.append("resume", file);
  formData.append("title", title);

  const response = await api.post("/resume", formData);

  return response.data;
};

export const updateResume = async (id, resumeData) => {
  const response = await api.patch(`/resume/${id}`, resumeData);

  return response.data;
};

export const deleteResume = async (id) => {
  const response = await api.delete(`/resume/${id}`);

  return response.data;
};
