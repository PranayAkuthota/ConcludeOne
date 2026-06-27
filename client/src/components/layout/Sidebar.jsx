import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Briefcase, Bot, BookOpen, CheckSquare, BarChart3, Settings, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const location = useLocation();
  const [approvalsCount, setApprovalsCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch("http://localhost:3005/api/approvals");
        if (res.ok) {
          const data = await res.json();
          setApprovalsCount(data.length);
        }
      } catch (e) {
        console.error("Failed to fetch approvals count");
      }
    };
    
    fetchCount();
    const interval = setInterval(fetchCount, 5000);
    return () => clearInterval(interval);
  }, []);

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Cases", href: "/cases", icon: Briefcase },
    { name: "Agent Orchestration", href: "/agents", icon: Bot },
    { name: "Knowledge Center", href: "/knowledge", icon: BookOpen },
    { name: "Memory", href: "#", icon: BrainCircuit },
    { name: "Approvals", href: "/approvals", icon: CheckSquare, badge: approvalsCount > 0 ? approvalsCount : null },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
  ];

  return (
    <div className="flex h-full w-[240px] flex-col border-r border-border bg-[#F9FAFB]">
      <div className="flex h-14 shrink-0 items-center px-6">
        <BrainCircuit className="h-5 w-5 text-primary mr-2" />
        <span className="text-sm font-bold tracking-tight uppercase">Conclude One</span>
      </div>
      
      <div className="flex flex-1 flex-col overflow-y-auto pt-6 pb-4">
        <nav className="flex-1 space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (location.pathname.startsWith("/cases") && item.href === "/cases");
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  isActive
                    ? "bg-gray-200/50 text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-gray-100 hover:text-foreground",
                  "group flex items-center justify-between rounded-md px-3 py-2 text-[13px] transition-colors"
                )}
              >
                <div className="flex items-center">
                  <item.icon
                    className={cn(
                      isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
                      "mr-3 h-4 w-4 flex-shrink-0 transition-colors"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </div>
                {item.badge && (
                  <span className="ml-auto inline-block rounded-full bg-destructive px-2 py-0.5 text-xs font-medium text-destructive-foreground">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 bg-[#F9FAFB]">
        <button className="flex w-full items-center rounded-md px-3 py-2 text-[13px] font-medium text-muted-foreground hover:bg-gray-100 hover:text-foreground transition-colors mb-4">
          <Settings className="mr-3 h-4 w-4 flex-shrink-0" />
          Settings
        </button>
        <div className="flex items-center space-x-3 px-3 py-2 border-t border-border/50 pt-4">
          <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-[10px]">
            CO
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-foreground leading-tight">Admin User</span>
            <span className="text-[11px] text-muted-foreground leading-tight">Enterprise Plan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
