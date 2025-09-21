import { useQuery } from "@tanstack/react-query";

async function fetchUser() {
  // Check real auth endpoint
  const response = await fetch("/api/auth/user");
  if (!response.ok) {
    if (response.status === 401) {
      return null; // User not authenticated
    }
    throw new Error(`Failed to fetch user: ${response.status}`);
  }
  return response.json();
}

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}