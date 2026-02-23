import { TrendingUp, TrendingDown, CheckCircle } from "lucide-react";

interface MetricCardProps {
  icon: "income" | "expense" | "saving";
  label: string;
  value: number;
  changePercent: number;
  comparisonText: string;
}

export default function MetricCard({ icon, label, value, changePercent, comparisonText }: MetricCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const isPositive = changePercent >= 0;
  
  const iconConfig = {
    income: { bg: "bg-primary/10", color: "text-primary", Icon: CheckCircle },
    expense: { bg: "bg-destructive/10", color: "text-destructive", Icon: CheckCircle },
    saving: { bg: "bg-chart-3/10", color: "text-chart-3", Icon: CheckCircle },
  };

  const { bg, color, Icon } = iconConfig[icon];

  return (
    <div className="bg-card border border-card-border p-4 lg:p-6 rounded-md">
      <div className="flex items-start justify-between mb-3 lg:mb-4 gap-2">
        <div className={`p-1.5 lg:p-2 rounded-md ${bg}`}>
          <Icon className={`w-4 h-4 lg:w-5 lg:h-5 ${color}`} />
        </div>
        <button className="text-xs lg:text-sm text-primary hover:underline" data-testid={`button-view-more-${label.toLowerCase().replace(/\s+/g, '-')}`}>
          View more
        </button>
      </div>

      <p className="text-xs lg:text-sm text-muted-foreground mb-1">{label}</p>
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
        <p className="text-xl lg:text-2xl font-bold" data-testid={`text-${label.toLowerCase().replace(/\s+/g, '-')}`}>
          {formatCurrency(value)}
        </p>
        <div className={`flex items-center gap-1 text-xs lg:text-sm font-medium ${isPositive ? 'text-primary' : 'text-destructive'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4" /> : <TrendingDown className="w-3 h-3 lg:w-4 lg:h-4" />}
          {Math.abs(changePercent).toFixed(1)}%
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2 hidden sm:block">{comparisonText}</p>
    </div>
  );
}
