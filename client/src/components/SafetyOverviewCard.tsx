import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, MoreHorizontal, Search, Shield, Zap } from "lucide-react";
import { Link } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SafetyOverviewCardProps {
  totalPlans: number;
  weeklyChange: number;
}

export default function SafetyOverviewCard({ totalPlans, weeklyChange }: SafetyOverviewCardProps) {
  return (
    <div className="relative overflow-hidden bg-primary text-primary-foreground p-5 lg:p-6 rounded-xl shadow-lg">
      <div className="absolute -right-8 -top-8 w-40 h-40 opacity-10">
        <Shield className="w-full h-full" />
      </div>
      <div className="absolute right-20 bottom-2 w-16 h-16 opacity-5">
        <Zap className="w-full h-full" />
      </div>
      
      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xl lg:text-2xl font-bold tracking-tight" data-testid="text-isp-title">
                ISP - Integrated Safety Plan
              </p>
              <p className="text-sm opacity-80">
                Your last minute risk assessment
              </p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search safety plans..." 
              className="pl-10 w-56 bg-white/95 text-foreground placeholder:text-muted-foreground border-0 rounded-lg shadow-sm"
              data-testid="input-search-plans"
            />
          </div>
          <Link href="/form2">
            <Button 
              size="default"
              variant="secondary"
              className="font-semibold rounded-lg shadow-sm"
              data-testid="button-new-plan"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Plan
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-primary-foreground rounded-lg"
                data-testid="button-more-safety"
              >
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem data-testid="menu-view-all">View All</DropdownMenuItem>
              <DropdownMenuItem data-testid="menu-export">Export</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="lg:hidden flex items-center gap-2">
          <Link href="/form2" className="flex-1">
            <Button 
              size="default"
              variant="secondary"
              className="w-full font-semibold rounded-lg shadow-sm"
              data-testid="button-new-plan-mobile"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Plan
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-primary-foreground rounded-lg"
                data-testid="button-more-safety-mobile"
              >
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem data-testid="menu-view-all-mobile">View All</DropdownMenuItem>
              <DropdownMenuItem data-testid="menu-export-mobile">Export</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
