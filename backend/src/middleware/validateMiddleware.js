import ApiError from "../utils/ApiError.js";

/*
|--------------------------------------------------------------------------
| Zod Validation Middleware
|--------------------------------------------------------------------------
|
| Validates a specific part of the Express request before the request
| reaches the controller/service layer.
|
| Supported targets:
| - body
| - params
| - query
|
| The parsed Zod result replaces the original request value so
| controllers receive normalized and validated data.
|--------------------------------------------------------------------------
*/

const validate = (schema, target = "body") => {
  const allowedTargets = ["body", "params", "query"];

  if (!allowedTargets.includes(target)) {
    throw new Error(
      `Invalid validation target "${target}". Expected body, params, or query.`
    );
  }

  return (req, res, next) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join(".") || target,
        message: issue.message,
      }));

      return next(new ApiError(400, "Validation failed", errors));
    }

    /*
    |--------------------------------------------------------------------------
    | Replace request data with Zod's parsed output
    |--------------------------------------------------------------------------
    |
    | This preserves:
    | - trimming
    | - coercion
    | - preprocessing
    | - defaults
    | - normalization
    |--------------------------------------------------------------------------
    */

    req[target] = result.data;

    return next();
  };
};

export default validate;
