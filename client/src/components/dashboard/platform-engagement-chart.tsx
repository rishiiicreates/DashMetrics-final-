import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type PlatformEngagementData = {
  platform: string;
  engagement: number;
  likes: number;
  comments: number;
  shares: number;
};

export function PlatformEngagementChart() {
  const [timeFrame, setTimeFrame] = useState<string>("30days");

  // Fetch platform engagement data
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/dashboard/platform-engagement'],
  });

  // Format data for the chart
  const chartData: PlatformEngagementData[] = data?.data || [];

  // Handle time frame change
  const handleTimeFrameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeFrame(e.target.value);
    // In a real app, we would refetch data with the new time frame
    // refetch with updated parameters
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-lg">Engagement by Platform</h3>
          <div>
            <select
              value={timeFrame}
              onChange={handleTimeFrameChange}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="30days">Last 30 days</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Year to date</option>
            </select>
          </div>
        </div>

        <div className="h-[240px]">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center text-status-error">
              Failed to load engagement data. Please try again.
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              No engagement data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 100]}
                />
                <Tooltip formatter={(value) => [`${value}%`, '']} />
                <Legend />
                <Bar
                  dataKey="likes"
                  name="Likes"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="comments"
                  name="Comments"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="shares"
                  name="Shares"
                  fill="#8B5CF6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
