import { useQuery } from "@tanstack/react-query";
import { getData } from "@/lib/api/axios";
import type { DashboardStats } from "@/mocks/handlers";

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard", "stats"],
    queryFn: () => getData<DashboardStats>("/dashboard/stats"),
  });
}
