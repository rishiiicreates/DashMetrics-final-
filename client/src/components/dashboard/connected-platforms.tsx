import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Settings,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Facebook,
  Plus,
  ExternalLink,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Platform = {
  id: number;
  userId: number;
  platformType: string;
  handle: string;
  isActive: boolean;
};

export function ConnectedPlatforms() {
  const [isAddPlatformOpen, setIsAddPlatformOpen] = useState(false);
  const [newPlatformType, setNewPlatformType] = useState("instagram");
  const [newPlatformHandle, setNewPlatformHandle] = useState("");
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch platforms
  const { data, isLoading, error } = useQuery<{ platforms: Platform[] }>({
    queryKey: ['/api/platforms'],
  });

  const platforms: Platform[] = data?.platforms || [];

  // Mutation for updating platform status
  const updatePlatformMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => 
      apiRequest("PATCH", `/api/platforms/${id}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/platforms'] });
      toast({
        title: "Platform updated",
        description: "Platform status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update platform status.",
        variant: "destructive",
      });
    },
  });

  // Mutation for adding a new platform
  const addPlatformMutation = useMutation({
    mutationFn: (platformData: { platformType: string; handle: string }) => 
      apiRequest("POST", "/api/platforms", platformData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/platforms'] });
      setIsAddPlatformOpen(false);
      setNewPlatformHandle("");
      toast({
        title: "Platform added",
        description: "New platform has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add new platform.",
        variant: "destructive",
      });
    },
  });

  // Get platform icon
  const getPlatformIcon = (platformType: string) => {
    switch (platformType) {
      case "instagram":
        return <Instagram className="h-6 w-6 text-primary" />;
      case "twitter":
        return <Twitter className="h-6 w-6 text-primary" />;
      case "linkedin":
        return <Linkedin className="h-6 w-6 text-primary" />;
      case "youtube":
        return <Youtube className="h-6 w-6 text-primary" />;
      case "facebook":
        return <Facebook className="h-6 w-6 text-primary" />;
      default:
        return <Instagram className="h-6 w-6 text-primary" />;
    }
  };
  
  // Get social media profile URL
  const getProfileUrl = (platformType: string, handle: string) => {
    switch (platformType) {
      case "instagram":
        return `https://www.instagram.com/${handle}/`;
      case "twitter":
        return `https://x.com/${handle}`;
      case "linkedin":
        return `https://www.linkedin.com/in/${handle}/`;
      case "youtube":
        return `https://youtube.com/@${handle}`;
      case "facebook":
        return `https://facebook.com/${handle}`;
      default:
        return "#";
    }
  };

  // Handle toggle platform status
  const handleTogglePlatformStatus = (id: number, currentStatus: boolean) => {
    updatePlatformMutation.mutate({ id, isActive: !currentStatus });
  };

  // Handle add platform
  const handleAddPlatform = () => {
    if (!newPlatformHandle.trim()) {
      toast({
        title: "Validation error",
        description: "Please enter a handle for the platform.",
        variant: "destructive",
      });
      return;
    }

    addPlatformMutation.mutate({
      platformType: newPlatformType,
      handle: newPlatformHandle,
    });
  };

  return (
    <Card>
      <CardHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-lg">Connected Platforms</h3>
      </CardHeader>

      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="py-6 text-center text-status-error">
            Failed to load connected platforms. Please try again.
          </div>
        ) : (
          <div className="space-y-4">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                    {getPlatformIcon(platform.platformType)}
                  </div>
                  <div>
                    <h4 className="font-medium capitalize">
                      {platform.platformType}
                    </h4>
                    {platform.isActive ? (
                      <a 
                        href={getProfileUrl(platform.platformType, platform.handle)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline hover:text-primary-dark flex items-center"
                      >
                        @{platform.handle}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Not connected
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      platform.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                    }`}
                  >
                    {platform.isActive ? "Active" : "Inactive"}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleTogglePlatformStatus(platform.id, platform.isActive)
                    }
                    className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 p-1 h-auto"
                    disabled={updatePlatformMutation.isPending}
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}

            {platforms.length === 0 && (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                No platforms connected yet. Click "Add New Platform" to get
                started.
              </div>
            )}

            <Dialog
              open={isAddPlatformOpen}
              onOpenChange={setIsAddPlatformOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="link"
                  className="mt-4 text-primary hover:text-primary-dark text-sm font-medium flex items-center p-0"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add New Platform
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Connect a new platform</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform-type">Platform</Label>
                    <select
                      id="platform-type"
                      value={newPlatformType}
                      onChange={(e) => setNewPlatformType(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="instagram">Instagram</option>
                      <option value="twitter">Twitter</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="youtube">YouTube</option>
                      <option value="facebook">Facebook</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform-handle">Handle/Username</Label>
                    <Input
                      id="platform-handle"
                      value={newPlatformHandle}
                      onChange={(e) => setNewPlatformHandle(e.target.value)}
                      placeholder="Enter your username"
                    />
                  </div>
                  <Button
                    onClick={handleAddPlatform}
                    className="w-full"
                    disabled={addPlatformMutation.isPending}
                  >
                    {addPlatformMutation.isPending
                      ? "Connecting..."
                      : "Connect Platform"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
