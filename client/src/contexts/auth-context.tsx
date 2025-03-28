import React, { createContext, useState, useContext, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  name: string;
  email: string;
  profilePic?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (userData: any) => Promise<void>;
  loginWithGithub: (userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  loginWithGoogle: async () => {},
  loginWithGithub: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (token) {
      fetchCurrentUser(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Fetch current user with token
  const fetchCurrentUser = async (token: string) => {
    try {
      // Use a hardcoded demo user for testing purposes
      // In a real app, we'd fetch the user from the API
      setUser({
        id: 1,
        name: "Hrishikesh",
        email: "rishiicreates@gmail.com",
        profilePic: "https://pbs.twimg.com/media/Gm-iaOwbYAM16us.jpg"
      });
      
      // The following code would be used in a real app:
      // const response = await apiRequest("GET", "/api/auth/me");
      // const userData = await response.json();
      // setUser(userData);
    } catch (error) {
      console.error("Error fetching current user:", error);
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  };

  // Login with email and password
  const login = async (email: string, password: string) => {
    try {
      // For demo purposes, hardcode successful login
      const demoUser = {
        id: 1,
        name: "Hrishikesh",
        email: email || "rishiicreates@gmail.com",
        profilePic: "https://pbs.twimg.com/media/Gm-iaOwbYAM16us.jpg"
      };
      
      // In a real app, we would authenticate with the server:
      // const response = await apiRequest("POST", "/api/auth/login", { email, password });
      // const data = await response.json();
      
      const demoToken = "demo-token-123";
      localStorage.setItem("token", demoToken);
      setUser(demoUser);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${demoUser.name}!`,
      });
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Login with Google
  const loginWithGoogle = async (userData: any) => {
    try {
      // For demo purposes, hardcode successful login
      const demoUser = {
        id: 1,
        name: userData.name || "Hrishikesh",
        email: userData.email || "rishiicreates@gmail.com",
        profilePic: userData.profilePic || "https://pbs.twimg.com/media/Gm-iaOwbYAM16us.jpg"
      };
      
      // In a real app, we would authenticate with Google:
      // const response = await apiRequest("POST", "/api/auth/google", userData);
      // const data = await response.json();
      
      const demoToken = "demo-google-token-123";
      localStorage.setItem("token", demoToken);
      setUser(demoUser);
      
      toast({
        title: "Google login successful",
        description: `Welcome, ${demoUser.name}!`,
      });
    } catch (error) {
      console.error("Google login error:", error);
      toast({
        title: "Google login failed",
        description: "Could not authenticate with Google.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Login with GitHub
  const loginWithGithub = async (userData: any) => {
    try {
      // For demo purposes, hardcode successful login
      const demoUser = {
        id: 1,
        name: userData.name || "Hrishikesh",
        email: userData.email || "rishiicreates@gmail.com",
        profilePic: userData.profilePic || "https://pbs.twimg.com/media/Gm-iaOwbYAM16us.jpg"
      };
      
      // In a real app, we would authenticate with GitHub:
      // const response = await apiRequest("POST", "/api/auth/github", userData);
      // const data = await response.json();
      
      const demoToken = "demo-github-token-123";
      localStorage.setItem("token", demoToken);
      setUser(demoUser);
      
      toast({
        title: "GitHub login successful",
        description: `Welcome, ${demoUser.name}!`,
      });
    } catch (error) {
      console.error("GitHub login error:", error);
      toast({
        title: "GitHub login failed",
        description: "Could not authenticate with GitHub.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        loginWithGoogle,
        loginWithGithub,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
