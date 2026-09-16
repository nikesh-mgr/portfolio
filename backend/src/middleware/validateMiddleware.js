import ApiError from "../utils/apiError.js";

const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join(".") || "body",
        message: issue.message,
      }));

      throw new ApiError(400, "Validation failed", errors);
    }

    req.body = result.data;

    next();
  };
};

export default validate;
