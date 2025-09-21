import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Fetch authenticated user from server
async function fetchUser() {
  const response = await fetch("/api/auth/user", {
    method: "GET",
    credentials: "include", // Include cookies
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      return null; // User not authenticated
    }
    throw new Error(`Failed to fetch user: ${response.status}`);
  }
  
  return response.json();
}

// Login function
async function loginUser(email: string, password: string) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Include cookies
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  const data = await response.json();
  return data.user;
}

// Register function
async function registerUser(email: string, password: string, firstName?: string, lastName?: string) {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Include cookies
    body: JSON.stringify({ email, password, firstName, lastName }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  const data = await response.json();
  return data.user;
}

// Logout function
async function logoutUser() {
  const response = await fetch("/api/auth/logout", { 
    method: "POST",
    credentials: "include", // Include cookies
  });
  
  if (!response.ok) {
    throw new Error('Logout failed');
  }
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => 
      loginUser(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ email, password, firstName, lastName }: { 
      email: string; 
      password: string; 
      firstName?: string; 
      lastName?: string; 
    }) => registerUser(email, password, firstName, lastName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // Clear all cached data and force re-fetch
      queryClient.removeQueries({ queryKey: ["/api/auth/user"] });
      queryClient.clear(); // Clear all cache
      // Force immediate redirect
      window.location.href = '/';
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error?.message,
    registerError: registerMutation.error?.message,
  };
}