import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import type { GuardianContact } from "../backend.d.ts";

export function useGuardianContact() {
  const { actor, isFetching } = useActor();
  return useQuery<GuardianContact>({
    queryKey: ["guardianContact"],
    queryFn: async () => {
      if (!actor) return { name: "", phoneNumber: "" };
      return actor.getGuardianContact();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveGuardianContact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, phoneNumber }: { name: string; phoneNumber: string }) => {
      if (!actor) throw new Error("No actor available");
      await actor.saveGuardianContact(name, phoneNumber);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guardianContact"] });
    },
  });
}

export function useLogPanicActivation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor available");
      await actor.logPanicActivation();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["panicLog"] });
    },
  });
}
