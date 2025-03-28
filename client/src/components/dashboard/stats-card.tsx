import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  Users, 
  BarChart2, 
  Eye, 
  Clock 
} from "lucide-react";

type StatsCardProps = {
  title: string;
  value: string;
  change: number; // Positive for increase, negative for decrease
  label: string;
  icon: 'users' | 'chart' | 'eye' | 'clock';
  iconBg: 'blue' | 'green' | 'purple' | 'yellow';
  className?: string;
};

export function StatsCard({ 
  title, 
  value, 
  change, 
  label, 
  icon, 
  iconBg,
  className = ""
}: StatsCardProps) {
  // Determine the direction of the change for styling
  const isPositive = change >= 0;
  
  // Mapping for icon backgrounds
  const bgColorMap = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-primary",
    green: "bg-green-100 dark:bg-green-900/30 text-secondary",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-accent",
    yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-status-warning"
  };
  
  // Get the icon component
  const IconComponent = () => {
    switch (icon) {
      case 'users':
        return <Users className="h-5 w-5" />;
      case 'chart':
        return <BarChart2 className="h-5 w-5" />;
      case 'eye':
        return <Eye className="h-5 w-5" />;
      case 'clock':
        return <Clock className="h-5 w-5" />;
      default:
        return <Users className="h-5 w-5" />;
    }
  };

  return (
    <div className={`analytics-card bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-all duration-200 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          <div className="flex items-center mt-2 text-sm">
            <span className={`${isPositive ? 'text-status-success' : 'text-status-error'} font-medium flex items-center`}>
              {isPositive ? (
                <ArrowUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 mr-1" />
              )}
              {isPositive ? '+' : ''}{change}%
            </span>
            <span className="text-gray-600 dark:text-gray-400 ml-1">{label}</span>
          </div>
        </div>
        <div className={`p-2 rounded-lg ${bgColorMap[iconBg]}`}>
          <IconComponent />
        </div>
      </div>
    </div>
  );
}
