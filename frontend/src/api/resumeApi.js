import api from "./axios";

export const getResume = async () => {
  const response = await api.get("/resume");

  return response.data;
};

export const uploadResume = async ({ file, title = "Resume" }) => {
  if (!(file instanceof File)) {
    throw new Error("Resume file is required.");
  }

  const formData = new FormData();

  formData.append("resume", file);
  formData.append("title", title);

  const response = await api.post("/resume", formData);

  return response.data;
};

export const updateResume = async (id, resumeData) => {
  if (!id) {
    throw new Error("Resume ID is required.");
  }

  const response = await api.patch(`/resume/${id}`, resumeData);

  return response.data;
};

export const deleteResume = async (id) => {
  if (!id) {
    throw new Error("Resume ID is required.");
  }

  const response = await api.delete(`/resume/${id}`);

  return response.data;
};
