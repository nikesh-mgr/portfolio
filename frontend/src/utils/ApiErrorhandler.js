const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

const getApiErrorMessage = (error, fallbackMessage = DEFAULT_ERROR_MESSAGE) => {
  if (!error) {
    return fallbackMessage;
  }

  if (!error.response) {
    return "Unable to connect to the server. Check your connection and try again.";
  }

  const { status, data } = error.response;

  if (status === 400) {
    return (
      data?.message || "Please check the information you entered and try again."
    );
  }

  if (status === 401) {
    return "Your session has expired. Please sign in again.";
  }

  if (status === 403) {
    return "You don't have permission to perform this action.";
  }

  if (status === 404) {
    return data?.message || "The requested item could not be found.";
  }

  if (status === 409) {
    return data?.message || "This item already exists.";
  }

  if (status === 422) {
    return (
      data?.message ||
      "Some of the information is invalid. Please review the form."
    );
  }

  if (status === 429) {
    return "Too many requests. Please wait a moment and try again.";
  }

  if (status >= 500) {
    return fallbackMessage;
  }

  return data?.message || fallbackMessage;
};

export const getApiValidationErrors = (error) => {
  const errors = error?.response?.data?.errors;

  return Array.isArray(errors) ? errors : [];
};

export default getApiErrorMessage;
