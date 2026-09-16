const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return value === "true";
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
    // Fall back to a single value.
  }

  return [String(value).trim()].filter(Boolean);
};

const parseNumber = (value, defaultValue = 0) => {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : defaultValue;
};

const parseExperienceFormData = (body) => {
  const data = {
    ...body,
  };

  if ("current" in body) {
    data.current = parseBoolean(body.current);
  }

  if ("featured" in body) {
    data.featured = parseBoolean(body.featured);
  }

  if ("order" in body) {
    data.order = parseNumber(body.order);
  }

  if ("responsibilities" in body) {
    data.responsibilities = parseArray(body.responsibilities);
  }

  if ("technologies" in body) {
    data.technologies = parseArray(body.technologies);
  }

  /*
   * Empty endDate should become null rather than "".
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
