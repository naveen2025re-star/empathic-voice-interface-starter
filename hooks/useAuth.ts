import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Check for authenticated user in localStorage
async function fetchUser() {
  if (typeof window !== 'undefined') {
    const authUser = localStorage.getItem('auth_user');
    if (authUser) {
      return JSON.parse(authUser);
    }
  }
  return null;
}

// Login function
async function loginUser(email: string, password: string) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  const data = await response.json();
  
  // Store user in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_user', JSON.stringify(data.user));
  }
  
  return data.user;
}

// Register function
async function registerUser(email: string, password: string, firstName?: string, lastName?: string) {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, firstName, lastName }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  const data = await response.json();
  
  // Store user in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_user', JSON.stringify(data.user));
  }
  
  return data.user;
}

// Logout function
async function logoutUser() {
  // Call logout endpoint
  await fetch("/api/auth/logout", { method: "POST" });
  
  // Remove user from localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_user');
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
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
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