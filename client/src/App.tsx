import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/ui/sidebar";
import { MobileNav } from "@/components/ui/mobile-nav";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import SavedContent from "@/pages/saved-content";
import Settings from "@/pages/settings";
import Login from "@/pages/login";
import Support from "@/pages/support";
import { useEffect } from "react";
import { ThemeProvider } from "@/contexts/theme-context";
import { AuthProvider } from "@/contexts/auth-context";

// Main layout component that wraps all authenticated pages
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [location] = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return (
    <div className="min-h-screen bg-dark-paper">
      <Sidebar />
      <MobileNav />
      <main className="pt-14 md:pt-4 md:pl-64 min-h-screen">
        <div className="container mx-auto px-4 md:px-6 max-w-[1200px]">
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  const [location] = useLocation();
  const isLoginPage = location === "/login";
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          {isLoginPage ? (
            <Login />
          ) : (
            <MainLayout>
              <Switch>
                <Route path="/" component={Dashboard} />
                <Route path="/saved-content" component={SavedContent} />
                <Route path="/settings" component={Settings} />
                <Route path="/support" component={Support} />
                <Route component={NotFound} />
              </Switch>
            </MainLayout>
          )}
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
