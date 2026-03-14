import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            {title}
          </p>
          <p className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary mt-1">
            {value}
          </p>
          
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-accent-success" />
              ) : (
                <TrendingDown className="w-4 h-4 text-accent-error" />
              )}
              <span
                className={`text-sm ${
                  trend.isPositive ? "text-accent-success" : "text-accent-error"
                }`}
              >
                {trend.value}%
              </span>
              <span className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                vs último mes
              </span>
            </div>
          )}
        </div>
        
        <div className="w-12 h-12 rounded-lg bg-accent-primary/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-accent-primary" />
        </div>
      </div>
    </div>
  );
}
