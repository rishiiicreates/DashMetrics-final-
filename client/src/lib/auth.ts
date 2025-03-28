// Helper functions for authentication

// Simulated Google OAuth login
// In a real app, this would use the actual Google OAuth API
export const simulateGoogleLogin = async () => {
  // For demo purposes, return mock user data
  return {
    email: "rishiicreates@gmail.com",
    name: "Hrishikesh",
    profilePic: "https://pbs.twimg.com/media/Gm-iaOwbYAM16us.jpg"
  };
};

// Simulated GitHub OAuth login
// In a real app, this would use the actual GitHub OAuth API
export const simulateGithubLogin = async () => {
  // For demo purposes, return mock user data
  return {
    email: "rishiicreates@gmail.com",
    name: "Hrishikesh",
    profilePic: "https://pbs.twimg.com/media/Gm-iaOwbYAM16us.jpg"
  };
};

// Function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

// Function to get token
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Function to set token
export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

// Function to clear token
export const clearToken = (): void => {
  localStorage.removeItem('token');
};

// Function to get auth header
export const getAuthHeader = (): { Authorization: string } | {} => {
  const token = getToken();
  
  // Create a demo token if none exists - for testing purposes only
  if (!token) {
    const demoToken = "demo-token-" + Math.random().toString(36).substring(2, 15);
    setToken(demoToken);
    console.log("Created demo token for testing:", demoToken);
    return { Authorization: `Bearer ${demoToken}` };
  }
  
  return token ? { Authorization: `Bearer ${token}` } : {};
};
