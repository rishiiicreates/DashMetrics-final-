import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageCircle, Tag, Clock, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ActivityType = "like" | "comment" | "mention" | "scheduled";

type Activity = {
  id: number;
  type: ActivityType;
  platform: string;
  message: string;
  time: string;
};

interface RecentActivityProps {
  className?: string;
}

export function RecentActivity({ className = "" }: RecentActivityProps) {
  // Fetch recent activities
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/dashboard/recent-activities'],
  });

  const activities: Activity[] = data?.activities || [];

  // Get the appropriate icon for the activity type
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "like":
        return (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <ThumbsUp className="h-5 w-5 text-primary" />
          </div>
        );
      case "comment":
        return (
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-accent" />
          </div>
        );
      case "mention":
        return (
          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
            <Tag className="h-5 w-5 text-secondary" />
          </div>
        );
      case "scheduled":
        return (
          <div className="w-10 h-10 rounded-full bg-status-warning/10 flex items-center justify-center">
            <Clock className="h-5 w-5 text-status-warning" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <ThumbsUp className="h-5 w-5 text-gray-500" />
          </div>
        );
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-semibold text-lg">Recent Activities</h3>
        <Button variant="link" className="text-primary p-0 h-auto">
          View All
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-status-error">
            Failed to load recent activities. Please try again.
          </div>
        ) : activities.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No recent activities found.
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {activities.map((activity) => (
              <div key={activity.id} className="px-6 py-4 flex items-start">
                <div className="flex-shrink-0 mr-4">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {activity.time}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 p-1 h-auto"
                    >
                      <MoreVertical className="h-5 w-5" />
                      <span className="sr-only">Options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Mark as read</DropdownMenuItem>
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem>Dismiss</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
