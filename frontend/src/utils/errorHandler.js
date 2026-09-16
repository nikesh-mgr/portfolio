export const getApiErrorMessage = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};

export const getApiValidationErrors = (error) => {
  return error?.response?.data?.errors || [];
};
