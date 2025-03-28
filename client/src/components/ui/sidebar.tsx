import { useLocation, Link } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { 
  LayoutDashboard, 
  Bookmark, 
  Settings, 
  HelpCircle,
  LogOut
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className = "" }: SidebarProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  
  // For testing purposes, create a demo user if none exists
  const displayUser = user || {
    id: 1,
    name: "Demo User",
    email: "demo@example.com",
    profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  };

  const isActive = (path: string) => location === path;

  const handleLogout = () => {
    console.log("Logout clicked");
    if (logout) {
      logout();
    }
  };

  return (
    <aside className={`fixed top-0 left-0 bottom-0 hidden md:flex flex-col w-64 bg-dark-paper backdrop-blur-sm bg-opacity-90 border-r border-gray-700/50 transition-all duration-300 shadow-lg ${className}`}>
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-primary animate-float" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h1 className="text-2xl font-doodle font-bold text-white tracking-wide">DashMetrics</h1>
        </div>
      </div>
      
      <nav className="flex-1 px-2 py-6 space-y-2 font-handwritten">
        <Link href="/">
          <a className={`no-underline flex items-center px-5 py-3 text-lg ${isActive("/") 
            ? "bg-purple-900/30 text-white border-l-4 border-primary animate-pulse" 
            : "text-gray-300 hover:bg-purple-900/20 hover:text-white transition-all duration-300"} 
            rounded-lg group transform hover:translate-x-1`}>
            <LayoutDashboard className={`w-6 h-6 mr-3 ${isActive("/") ? "text-primary" : ""}`} />
            Dashboard
          </a>
        </Link>
        
        <Link href="/saved-content">
          <a className={`no-underline flex items-center px-5 py-3 text-lg ${isActive("/saved-content") 
            ? "bg-purple-900/30 text-white border-l-4 border-primary animate-pulse" 
            : "text-gray-300 hover:bg-purple-900/20 hover:text-white transition-all duration-300"} 
            rounded-lg group transform hover:translate-x-1`}>
            <Bookmark className={`w-6 h-6 mr-3 ${isActive("/saved-content") ? "text-primary" : ""}`} />
            Saved Content
          </a>
        </Link>
        
        <Link href="/settings">
          <a className={`no-underline flex items-center px-5 py-3 text-lg ${isActive("/settings") 
            ? "bg-purple-900/30 text-white border-l-4 border-primary animate-pulse" 
            : "text-gray-300 hover:bg-purple-900/20 hover:text-white transition-all duration-300"} 
            rounded-lg group transform hover:translate-x-1`}>
            <Settings className={`w-6 h-6 mr-3 ${isActive("/settings") ? "text-primary" : ""}`} />
            Settings
          </a>
        </Link>
        
        <Link href="/support">
          <a className={`no-underline flex items-center px-5 py-3 text-lg ${isActive("/support") 
            ? "bg-purple-900/30 text-white border-l-4 border-primary animate-pulse" 
            : "text-gray-300 hover:bg-purple-900/20 hover:text-white transition-all duration-300"} 
            rounded-lg group transform hover:translate-x-1`}>
            <HelpCircle className={`w-6 h-6 mr-3 ${isActive("/support") ? "text-primary" : ""}`} />
            Help & Support
          </a>
        </Link>
      </nav>

      <div className="p-5 border-t border-gray-700/50 bg-purple-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {displayUser?.profilePic ? (
              <img 
                src={displayUser.profilePic} 
                alt={`${displayUser.name}'s profile`} 
                className="w-10 h-10 rounded-full border-2 border-purple-400 shadow-lg"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center border-2 border-purple-400 font-doodle shadow-lg">
                {(displayUser?.name || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-doodle text-white font-medium">{displayUser?.name || "User"}</p>
              <p className="text-xs text-gray-300 font-handwritten">{displayUser?.email || "user@example.com"}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-purple-900/30 transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
