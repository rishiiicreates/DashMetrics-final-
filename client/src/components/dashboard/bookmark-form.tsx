import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Bookmark, Instagram, Twitter, Linkedin, Youtube, Tag, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";

type PlatformType = "instagram" | "twitter" | "linkedin" | "youtube";

export function BookmarkForm() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>("instagram");
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Tag suggestion mutation
  const tagSuggestionMutation = useMutation({
    mutationFn: (data: {
      title: string;
      url: string;
      platformType: string;
    }) => apiRequest("POST", "/api/ai/tag-suggestions", data),
    onSuccess: (data: any) => {
      if (data && data.suggestions && Array.isArray(data.suggestions)) {
        setSuggestedTags(data.suggestions);
      }
    },
    onError: () => {
      toast({
        title: "AI Suggestions Unavailable",
        description: "Unable to fetch AI-powered tag suggestions.",
        variant: "destructive",
      });
      setSuggestedTags([]); // Clear suggestions on error
    },
    onSettled: () => {
      setIsLoadingTags(false);
    }
  });
  
  // Add bookmark mutation
  const addBookmarkMutation = useMutation({
    mutationFn: (bookmarkData: {
      title: string;
      url: string;
      platformType: string;
      tags: string[];
    }) => apiRequest("POST", "/api/bookmarks", bookmarkData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookmarks'] });
      toast({
        title: "Bookmark saved",
        description: "Your content has been bookmarked successfully.",
      });
      // Reset form
      setTitle("");
      setUrl("");
      setTags("");
      setSelectedPlatform("instagram");
      setSuggestedTags([]);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save bookmark. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Request AI tag suggestions when title and URL are entered
  useEffect(() => {
    // Only get suggestions if we have a title or URL
    if ((title.trim() || url.trim()) && !isLoadingTags) {
      const debounceTags = setTimeout(() => {
        setIsLoadingTags(true);
        tagSuggestionMutation.mutate({
          title: title.trim(),
          url: url.trim(),
          platformType: selectedPlatform
        });
      }, 1000); // Debounce for 1 second
      
      return () => clearTimeout(debounceTags);
    }
  }, [title, url, selectedPlatform]);
  
  // Handle adding a suggested tag
  const addSuggestedTag = (tag: string) => {
    const currentTags = tags.split(",").map(t => t.trim()).filter(t => t);
    if (!currentTags.includes(tag)) {
      const newTags = [...currentTags, tag].join(", ");
      setTags(newTags);
      
      // Remove the tag from suggestions
      setSuggestedTags(suggestedTags.filter(t => t !== tag));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !url.trim()) {
      toast({
        title: "Validation error",
        description: "Title and URL are required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate URL
    try {
      new URL(url);
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL including http:// or https://",
        variant: "destructive",
      });
      return;
    }

    // Process tags
    const tagArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    // Submit bookmark
    addBookmarkMutation.mutate({
      title,
      url,
      platformType: selectedPlatform,
      tags: tagArray,
    });
  };

  // Platform button component
  const PlatformButton = ({
    platform,
    icon,
    label,
  }: {
    platform: PlatformType;
    icon: React.ReactNode;
    label: string;
  }) => (
    <button
      type="button"
      onClick={() => setSelectedPlatform(platform)}
      className={`flex items-center px-3 py-1 text-sm rounded-md ${
        selectedPlatform === platform
          ? "bg-primary/10 text-primary"
          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <Card>
      <CardHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-lg">Save Content</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Bookmark posts and content for later
        </p>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bookmark-title" className="mb-1 block">
                Title
              </Label>
              <Input
                id="bookmark-title"
                placeholder="Add a title for this bookmark"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={addBookmarkMutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="bookmark-url" className="mb-1 block">
                URL
              </Label>
              <Input
                id="bookmark-url"
                type="url"
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={addBookmarkMutation.isPending}
              />
            </div>

            <div>
              <Label htmlFor="bookmark-tags" className="mb-1 block">
                Tags
              </Label>
              <Input
                id="bookmark-tags"
                placeholder="Add tags separated by commas"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                disabled={addBookmarkMutation.isPending}
              />
              
              {/* AI tag suggestions */}
              {(suggestedTags.length > 0 || isLoadingTags) && (
                <div className="mt-2">
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <Sparkles className="h-3 w-3 mr-1" />
                    <span>AI-suggested tags</span>
                    {isLoadingTags && (
                      <div className="ml-2 h-3 w-3 rounded-full border-2 border-t-transparent border-primary animate-spin"></div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedTags.map((tag) => (
                      <Badge 
                        key={tag}
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary/20 transition-colors duration-200 flex items-center text-xs py-0 h-6"
                        onClick={() => addSuggestedTag(tag)}
                      >
                        <Tag className="h-3 w-3 mr-1 opacity-70" /> 
                        {tag}
                      </Badge>
                    ))}
                    {suggestedTags.length === 0 && isLoadingTags && (
                      <div className="w-full text-xs text-gray-500">
                        Generating suggestions...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label className="mb-1 block">Platform</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                <PlatformButton
                  platform="instagram"
                  icon={<Instagram className="h-4 w-4 mr-1" />}
                  label="Instagram"
                />
                <PlatformButton
                  platform="twitter"
                  icon={<Twitter className="h-4 w-4 mr-1" />}
                  label="Twitter"
                />
                <PlatformButton
                  platform="linkedin"
                  icon={<Linkedin className="h-4 w-4 mr-1" />}
                  label="LinkedIn"
                />
                <PlatformButton
                  platform="youtube"
                  icon={<Youtube className="h-4 w-4 mr-1" />}
                  label="YouTube"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full"
                disabled={addBookmarkMutation.isPending}
              >
                <Bookmark className="h-5 w-5 mr-2" />
                {addBookmarkMutation.isPending
                  ? "Saving..."
                  : "Save Bookmark"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
