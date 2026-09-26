const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalizedValue = value.trim().toLowerCase();

    if (normalizedValue === "true") {
      return true;
    }

    if (normalizedValue === "false") {
      return false;
    }
  }

  /*
   * Preserve invalid values instead of silently converting them.
   *
   * The feature validator will reject the value with a proper
   * validation error.
   */
  return value;
};

const parseArray = (value) => {
  if (value === undefined || value === null || value === "") {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item).trim()).filter(Boolean);
    }
  } catch {
    /*
     * Multipart forms commonly submit arrays as a comma-separated
     * or single string value.
     *
     * Treat the original value as one item rather than inventing
     * additional structure.
     */
  }

  return [String(value).trim()].filter(Boolean);
};

const parseNumber = (value, defaultValue = 0) => {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : value;
  }

  if (typeof value === "string") {
    const normalizedValue = value.trim();

    if (normalizedValue === "") {
      return defaultValue;
    }

    const parsed = Number(normalizedValue);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  /*
   * Preserve invalid input so validation can reject it.
   */
  return value;
};

const parseExperienceFormData = (body) => {
  const data = {
    ...body,
  };

  /*
   * Boolean form fields arrive as strings when using
   * multipart/form-data.
   */
  if ("current" in body) {
    data.current = parseBoolean(body.current);
  }

  if ("featured" in body) {
    data.featured = parseBoolean(body.featured);
  }

  /*
   * Numeric form fields also arrive as strings.
   */
  if ("order" in body) {
    data.order = parseNumber(body.order);
  }

  /*
   * Array fields can arrive as JSON strings, repeated fields,
   * or individual string values.
   */
  if ("responsibilities" in body) {
    data.responsibilities = parseArray(body.responsibilities);
  }

  if ("technologies" in body) {
    data.technologies = parseArray(body.technologies);
  }

  /*
   * Empty optional dates should become null.
   */
  if (body.endDate === "" || body.endDate === undefined) {
    data.endDate = null;
  }

  /*
   * Empty optional values should become null.
   */
  if (body.location === "") {
    data.location = null;
  }

  if (body.description === "") {
    data.description = null;
  }

  if (body.companyUrl === "") {
    data.companyUrl = null;
  }

  return data;
};

export default parseExperienceFormData;
