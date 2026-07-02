import { useQuery } from "@tanstack/react-query";
import { getRuntimeStatus } from "../api/runtime";

export function useRuntime() {
  return useQuery({
    queryKey:["runtime"],
    queryFn:getRuntimeStatus,
    refetchInterval:3000,
  });
}
