import api from "./axios";

export const getSkills = async ({ category } = {}) => {
  const response = await api.get("/skills", {
    params: category ? { category } : undefined,
  });

  return response.data;
};

export const getSkillById = async (id) => {
  const response = await api.get(`/skills/${id}`);

  return response.data;
};

export const createSkill = async (data) => {
  const response = await api.post("/skills", data);

  return response.data;
};

export const updateSkill = async (id, data) => {
  const response = await api.patch(`/skills/${id}`, data);

  return response.data;
};

export const deleteSkill = async (id) => {
  const response = await api.delete(`/skills/${id}`);

  return response.data;
};
