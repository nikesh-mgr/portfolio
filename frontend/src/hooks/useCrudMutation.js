import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import getApiErrorMessage from "@/utils/apiErrorhandler";

const useCrudMutation = ({
  mutationFn,
  queryKeys = [],
  successMessage,
  errorMessage = "The action could not be completed. Please try again.",
  onSuccess,
  onError,
  ...mutationOptions
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,

    onSuccess: async (data, variables, context) => {
      if (queryKeys.length > 0) {
        await Promise.all(
          queryKeys.map((queryKey) =>
            queryClient.invalidateQueries({
              queryKey,
            }),
          ),
        );
      }

      if (successMessage) {
        toast.success(successMessage);
      }

      await onSuccess?.(data, variables, context);
    },

    onError: async (error, variables, context) => {
      toast.error(getApiErrorMessage(error, errorMessage));

      await onError?.(error, variables, context);
    },

    ...mutationOptions,
  });
};

export default useCrudMutation;
