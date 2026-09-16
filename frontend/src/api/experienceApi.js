import api from "./axios";

const appendField = (formData, key, value) => {
  if (value === undefined || value === null || value === "") {
    return;
  }

  formData.append(key, String(value));
};

const appendArray = (formData, key, values) => {
  if (!Array.isArray(values)) {
    return;
  }

  /*
   * Send arrays as JSON strings.
   *
   * The backend controller/service can then normalize
   * them before passing them to Mongoose.
   */
  formData.append(
    key,
    JSON.stringify(values.map((value) => value.trim()).filter(Boolean)),
  );
};

const buildExperienceFormData = (data) => {
  const formData = new FormData();

  appendField(formData, "company", data.company);
  appendField(formData, "position", data.position);
  appendField(formData, "location", data.location);
  appendField(formData, "employmentType", data.employmentType);

  appendField(formData, "startDate", data.startDate);

  /*
   * Always send current so false can be explicitly
   * applied during updates.
   */
  formData.append("current", data.current ? "true" : "false");

  /*
   * Don't send endDate for current experiences.
   */
  if (!data.current && data.endDate) {
    appendField(formData, "endDate", data.endDate);
  }

  appendField(formData, "description", data.description);

  appendArray(formData, "responsibilities", data.responsibilities);

  appendArray(formData, "technologies", data.technologies);

  appendField(formData, "companyUrl", data.companyUrl);

  formData.append("featured", data.featured ? "true" : "false");

  formData.append("order", String(Number(data.order) || 0));

  if (data.companyLogo instanceof File) {
    formData.append("companyLogo", data.companyLogo);
  }

  return formData;
};

export const getExperiences = async () => {
  const response = await api.get("/experiences");

  return response.data;
};

export const getExperienceById = async (id) => {
  const response = await api.get(`/experiences/${id}`);

  return response.data;
};

export const createExperience = async (data) => {
  const formData = buildExperienceFormData(data);

  const response = await api.post("/experiences", formData);

  return response.data;
};

export const updateExperience = async (id, data) => {
  const formData = buildExperienceFormData(data);

  const response = await api.patch(`/experiences/${id}`, formData);

  return response.data;
};

export const deleteExperience = async (id) => {
  const response = await api.delete(`/experiences/${id}`);

  return response.data;
};
