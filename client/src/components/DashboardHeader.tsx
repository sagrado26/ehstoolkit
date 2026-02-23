import { Search, Bell, Calendar, Download, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSidebar } from "@/hooks/use-sidebar";

interface DashboardHeaderProps {
  userName: string;
  dateRange: string;
  setDateRange: (value: string) => void;
}

export default function DashboardHeader({ userName, dateRange, setDateRange }: DashboardHeaderProps) {
  const { isMobile, toggleMobileOpen } = useSidebar();

  return (
    <header className="bg-background border-b border-border px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleMobileOpen} data-testid="button-mobile-menu">
              <Menu className="w-5 h-5" />
            </Button>
          )}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search" 
              className="pl-10 bg-muted"
              data-testid="input-search"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <Button variant="ghost" size="icon" data-testid="button-notifications">
            <Bell className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <Avatar className="w-9 h-9">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {userName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hidden md:block">{userName}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 lg:mt-6 gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold">Welcome Back, {userName.split(' ')[0]}!</h1>
          <p className="text-sm text-muted-foreground hidden sm:block">All general information appears in this page.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-28 lg:w-32" data-testid="select-date-range">
              <SelectValue placeholder="Last 7 Days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>

          <div className="items-center gap-2 text-sm text-muted-foreground hidden lg:flex">
            <Calendar className="w-4 h-4" />
            <span>1 Jun - 2 Jun 2024</span>
          </div>

          <Button variant="outline" size="sm" data-testid="button-export">
            <Download className="w-4 h-4 lg:mr-2" />
            <span className="hidden lg:inline">Export</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
