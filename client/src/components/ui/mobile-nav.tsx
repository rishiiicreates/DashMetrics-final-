import { useState } from "react";
import { Link } from "wouter";
import { 
  Menu, 
  X,
  LayoutDashboard, 
  Bookmark, 
  Settings, 
  HelpCircle,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export function MobileNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Try to use auth context, but don't fail if it's not available
  let user: { id?: number; name?: string; email?: string; profilePic?: string } | null = null;
  let logout: (() => void) | undefined = undefined;
  
  try {
    const auth = useAuth();
    user = auth?.user;
    logout = auth?.logout;
  } catch (error) {
    console.log("Auth context not available, using demo user");
  }
  
  // Create a demo user for testing
  const displayUser = user || {
    id: 1,
    name: "Demo User",
    email: "demo@example.com",
    profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      console.log("Logout function not available");
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-dark-paper backdrop-blur-sm bg-opacity-95 border-b border-gray-700/50 z-20 shadow-md h-14">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-primary animate-float" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h1 className="text-xl font-doodle font-bold text-white tracking-wide">DashMetrics</h1>
          </div>
          
          <button 
            onClick={toggleMenu}
            className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-purple-900/30 transition-all duration-300"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden">
          <div className="bg-dark-paper h-full w-72 p-5 flex flex-col animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-primary animate-float" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h1 className="text-xl font-doodle font-bold text-white tracking-wide">DashMetrics</h1>
              </div>
              <button 
                onClick={toggleMenu}
                className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-purple-900/30 transition-all duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* User info */}
            <div className="flex items-center space-x-3 mb-8 pb-5 border-b border-gray-700/50 bg-purple-900/10 p-4 rounded-lg">
              {displayUser?.profilePic ? (
                <img 
                  src={displayUser.profilePic} 
                  alt={`${displayUser.name}'s profile`} 
                  className="w-12 h-12 rounded-full border-2 border-purple-400 shadow-lg"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center border-2 border-purple-400 shadow-lg font-doodle">
                  {(displayUser?.name || "U").charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-doodle text-white text-lg">{displayUser?.name || "Demo User"}</p>
                <p className="text-sm text-gray-300 font-handwritten">{displayUser?.email || "demo@example.com"}</p>
              </div>
            </div>

            {/* Mobile navigation */}
            <nav className="flex-1 space-y-2 font-handwritten">
              <Link href="/">
                <a 
                  className="no-underline flex items-center px-5 py-3 text-lg text-gray-300 hover:bg-purple-900/20 hover:text-white transition-all duration-300 rounded-lg group transform hover:translate-x-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard className="w-6 h-6 mr-3 text-primary" />
                  Dashboard
                </a>
              </Link>
              
              <Link href="/saved-content">
                <a 
                  className="no-underline flex items-center px-5 py-3 text-lg text-gray-300 hover:bg-purple-900/20 hover:text-white transition-all duration-300 rounded-lg group transform hover:translate-x-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Bookmark className="w-6 h-6 mr-3 text-primary" />
                  Saved Content
                </a>
              </Link>
              
              <Link href="/settings">
                <a 
                  className="no-underline flex items-center px-5 py-3 text-lg text-gray-300 hover:bg-purple-900/20 hover:text-white transition-all duration-300 rounded-lg group transform hover:translate-x-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="w-6 h-6 mr-3 text-primary" />
                  Settings
                </a>
              </Link>
              
              <Link href="/support">
                <a 
                  className="no-underline flex items-center px-5 py-3 text-lg text-gray-300 hover:bg-purple-900/20 hover:text-white transition-all duration-300 rounded-lg group transform hover:translate-x-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <HelpCircle className="w-6 h-6 mr-3 text-primary" />
                  Help & Support
                </a>
              </Link>
            </nav>

            {/* Logout button */}
            <div className="pt-4 border-t border-gray-700/50 mt-4">
              <button 
                onClick={handleLogout}
                className="no-underline flex items-center px-5 py-3 text-lg text-gray-300 hover:bg-purple-900/30 hover:text-white transition-all duration-300 rounded-lg group w-full font-handwritten"
              >
                <LogOut className="w-6 h-6 mr-3 text-primary" />
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
