import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Image,
  Video,
  FileText,
  MessageSquare,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

type ContentType = "image" | "video" | "article" | "thread";

type TopContentItem = {
  id: number;
  rank: number;
  platform: string;
  type: ContentType;
  title: string;
  growth: number;
  engagement: number;
  score: number;
};

export function TopContent() {
  // Fetch top content data
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/dashboard/top-content'],
  });

  const topContent: TopContentItem[] = data?.content || [];

  // Get the appropriate icon for the content type
  const getContentTypeIcon = (type: ContentType, platform: string) => {
    switch (type) {
      case "image":
        return <Image className="h-4 w-4 text-primary mr-1" />;
      case "video":
        return <Video className="h-4 w-4 text-status-warning mr-1" />;
      case "article":
        return <FileText className="h-4 w-4 text-accent mr-1" />;
      case "thread":
        return <MessageSquare className="h-4 w-4 text-secondary mr-1" />;
      default:
        return <Image className="h-4 w-4 text-primary mr-1" />;
    }
  };

  // Get the platform name with correct capitalization
  const getPlatformName = (platform: string): string => {
    switch (platform) {
      case "instagram":
        return "Instagram Post";
      case "twitter":
        return "Twitter Thread";
      case "linkedin":
        return "LinkedIn Article";
      case "youtube":
        return "YouTube Video";
      case "facebook":
        return "Facebook Post";
      default:
        return `${platform.charAt(0).toUpperCase() + platform.slice(1)} Post`;
    }
  };

  return (
    <Card>
      <CardHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-lg">Top Performing Content</h3>
      </CardHeader>

      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center text-status-error p-4">
            Failed to load top content. Please try again.
          </div>
        ) : topContent.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 p-4">
            No top content found.
          </div>
        ) : (
          topContent.map((content, index) => (
            <div key={content.id} className="mb-4 last:mb-0">
              <div className="flex items-center">
                <span className="text-sm font-semibold w-6 mr-3">
                  {content.rank}
                </span>
                <div className="flex-1">
                  <div className="flex items-center">
                    {getContentTypeIcon(content.type, content.platform)}
                    <span className="text-sm font-medium">
                      {getPlatformName(content.platform)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                    {content.title}
                  </p>
                </div>
                <div className="text-right">
                  <div
                    className={`flex items-center justify-end text-xs font-medium ${
                      content.growth >= 0
                        ? "text-status-success"
                        : "text-status-error"
                    }`}
                  >
                    {content.growth >= 0 ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(content.growth)}%
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {content.engagement >= 1000
                      ? `${(content.engagement / 1000).toFixed(1)}K`
                      : content.engagement}{" "}
                    {content.type === "video"
                      ? "views"
                      : content.type === "article"
                      ? "reactions"
                      : content.type === "thread"
                      ? "retweets"
                      : "likes"}
                  </p>
                </div>
              </div>
              <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-2">
                <div
                  className="h-1 bg-primary rounded-full"
                  style={{ width: `${content.score}%` }}
                ></div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
