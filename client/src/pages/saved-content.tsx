import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/theme-context";
import { getAuthHeader } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Bookmark, Search, Sun, Moon, ExternalLink, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

type BookmarkType = {
  id: number;
  userId: number;
  title: string;
  url: string;
  platformType: string;
  tags: string[];
};

export default function SavedContent() {
  const { toggleTheme, theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: bookmarksData, isLoading, refetch } = useQuery({ 
    queryKey: ['/api/bookmarks'],
  });

  const bookmarks: BookmarkType[] = bookmarksData?.bookmarks || [];

  // Filter bookmarks based on search query and active tag
  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchesSearch = bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        bookmark.url.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = activeTag ? bookmark.tags.includes(activeTag) : true;

    return matchesSearch && matchesTag;
  });

  // Extract all unique tags from bookmarks
  const allTags = [...new Set(bookmarks.flatMap(bookmark => bookmark.tags || []))];

  const handleDeleteBookmark = async (id: number) => {
    try {
      await apiRequest("DELETE", `/api/bookmarks/${id}`);
      toast({
        title: "Bookmark deleted",
        description: "The bookmark has been successfully deleted.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete bookmark",
        variant: "destructive",
      });
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400';
      case 'twitter': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'linkedin': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'youtube': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'facebook': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <>
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-doodle text-white">Saved Content</h1>
          <p className="mt-1 text-gray-300 font-handwritten">Manage your bookmarked posts and content</p>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0 space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="search" 
              placeholder="Search bookmarks..." 
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
      
      {/* Tags Filter */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Tag className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
          <h3 className="text-sm font-medium text-gray-300">Filter by tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeTag === null ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveTag(null)}
            className="text-xs"
          >
            All
          </Button>
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={activeTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className="text-xs"
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Bookmarks */}
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredBookmarks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bookmark className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-300 mb-2">No bookmarks found</h3>
            <p className="text-gray-400 text-center max-w-md">
              {searchQuery || activeTag
                ? "Try adjusting your search or filter criteria"
                : "You haven't saved any content yet. Add bookmarks from the dashboard."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-2">
                    <div className={`flex-shrink-0 rounded-md p-2 ${getPlatformColor(bookmark.platformType)}`}>
                      <Bookmark className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-lg">{bookmark.title}</CardTitle>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteBookmark(bookmark.id)}
                    className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 -mt-1 -mr-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <a 
                  href={bookmark.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-primary flex items-center"
                >
                  <ExternalLink className="h-3 w-3 mr-1 inline" />
                  {bookmark.url.replace(/^https?:\/\//, '').substring(0, 30)}
                  {bookmark.url.replace(/^https?:\/\//, '').length > 30 ? '...' : ''}
                </a>
                
                <Separator className="my-3" />
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {bookmark.tags?.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
