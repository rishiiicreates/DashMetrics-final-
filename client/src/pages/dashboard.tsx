import { useState } from "react";
import { useTheme } from "@/contexts/theme-context";
import { StatsCard } from "@/components/dashboard/stats-card";
import { FollowerGrowthChart } from "@/components/dashboard/follower-growth-chart";
import { PlatformEngagementChart } from "@/components/dashboard/platform-engagement-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { TopContent } from "@/components/dashboard/top-content";
import { ConnectedPlatforms } from "@/components/dashboard/connected-platforms";
import { BookmarkForm } from "@/components/dashboard/bookmark-form";
import { Search, Sun, Moon } from "lucide-react";

export default function Dashboard() {
  const { toggleTheme, theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold font-doodle text-white">Dashboard</h1>
          <p className="mt-1 text-gray-300 font-handwritten">Analyze your social media performance</p>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0 space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="search" 
              placeholder="Search analytics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <button 
            onClick={toggleTheme}
            className="theme-toggle p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Total Followers"
          value="24,563"
          change={3.2}
          label="vs last month"
          icon="users"
          iconBg="blue"
        />
        
        <StatsCard 
          title="Engagement Rate"
          value="5.2%"
          change={0.8}
          label="vs last month"
          icon="chart"
          iconBg="green"
        />
        
        <StatsCard 
          title="Post Reach"
          value="83,247"
          change={-1.4}
          label="vs last month"
          icon="eye"
          iconBg="purple"
        />
        
        <StatsCard 
          title="Avg. Response Time"
          value="47 min"
          change={12.5}
          label="vs last month"
          icon="clock"
          iconBg="yellow"
        />
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <FollowerGrowthChart />
        <PlatformEngagementChart />
      </div>
      
      {/* Recent Activities & Top Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <RecentActivity className="lg:col-span-2" />
        <TopContent />
      </div>
      
      {/* Platform Connections & Bookmark Creation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConnectedPlatforms />
        <BookmarkForm />
      </div>
    </>
  );
}
