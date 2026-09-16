import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCrudMutation = ({
  mutationFn,
  queryKeys = [],
  successMessage,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,

    onSuccess: async (data) => {
      await Promise.all(
        queryKeys.map((queryKey) =>
          queryClient.invalidateQueries({
            queryKey,
          }),
        ),
      );

      onSuccess?.(data);
    },
  });
};

export default useCrudMutation;
