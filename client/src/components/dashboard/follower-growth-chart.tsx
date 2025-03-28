import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type FollowerGrowthData = {
  date: string;
  instagram?: number;
  twitter?: number;
  linkedin?: number;
};

export function FollowerGrowthChart() {
  const [timeRange, setTimeRange] = useState<'30' | '90' | '365'>('30');
  
  // Fetch follower growth data
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/dashboard/follower-growth'],
  });

  // Format data for the chart
  const chartData: FollowerGrowthData[] = data?.data || [];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-lg">Follower Growth</h3>
          <div className="flex space-x-2">
            <Button
              variant={timeRange === '30' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('30')}
              className="text-xs h-8"
            >
              30 Days
            </Button>
            <Button
              variant={timeRange === '90' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('90')}
              className="text-xs h-8"
            >
              90 Days
            </Button>
            <Button
              variant={timeRange === '365' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('365')}
              className="text-xs h-8"
            >
              1 Year
            </Button>
          </div>
        </div>
        
        <div className="h-[240px]">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center text-status-error">
              Failed to load follower data. Please try again.
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              No follower data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => {
                    const d = new Date(date);
                    return `${d.getMonth() + 1}/${d.getDate()}`;
                  }}
                  stroke="#888"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#888"
                  fontSize={12}
                  tickFormatter={(value) => {
                    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                    return value;
                  }}
                />
                <Tooltip 
                  formatter={(value) => [`${value} followers`, '']} 
                  labelFormatter={(label) => {
                    const d = new Date(label);
                    return d.toLocaleDateString();
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="instagram"
                  stroke="#3B82F6" // primary color
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="twitter"
                  stroke="#10B981" // secondary color
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="linkedin"
                  stroke="#8B5CF6" // accent color
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
