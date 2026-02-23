import { useQuery } from "@tanstack/react-query";

export function useIsAdmin(): boolean {
  const { data: preferences } = useQuery<{ role?: string }>({
    queryKey: ["/api/user-preferences", "default"],
  });
  return preferences?.role === "admin";
}
