import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Inbox, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Image,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/' },
  { icon: Inbox, label: 'Submissions', path: '/submissions' },
  { icon: Image, label: 'Portfolio', path: '/portfolio' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function DashboardSidebar({ collapsed, onToggle, isMobile }: DashboardSidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 ease-in-out",
        // Mobile: fixed overlay sidebar
        isMobile ? [
          "fixed inset-y-0 left-0 z-50",
          collapsed ? "-translate-x-full" : "translate-x-0",
          "w-64"
        ] : [
          // Desktop: static sidebar
          "relative",
          collapsed ? "w-16" : "w-64"
        ]
      )}
    >
      {/* Logo */}
      <div className={cn(
        "h-16 flex items-center border-b border-sidebar-border px-4",
        collapsed && !isMobile ? "justify-center" : "justify-between"
      )}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-sidebar-primary" />
          </div>
          {(!collapsed || isMobile) && (
            <div className="animate-fade-in">
              <h1 className="font-display text-lg font-semibold text-sidebar-foreground">
                Kirti Mistry
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">
                Interior Design
              </p>
            </div>
          )}
        </div>
        {isMobile && !collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-sidebar-foreground/80 hover:text-sidebar-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => isMobile && onToggle()}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    "hover:bg-sidebar-accent",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-primary font-medium" 
                      : "text-sidebar-foreground/80",
                    collapsed && !isMobile && "justify-center"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 flex-shrink-0",
                    isActive ? "text-sidebar-primary" : "text-sidebar-foreground/60"
                  )} />
                  {(!collapsed || isMobile) && (
                    <span className="animate-fade-in text-sm">{item.label}</span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Quote */}
      {(!collapsed || isMobile) && (
        <div className="p-4 mx-3 mb-4 rounded-lg bg-sidebar-accent/50 animate-fade-in hidden sm:block">
          <p className="text-xs italic text-sidebar-foreground/70 leading-relaxed">
            "The best rooms have something to say about the people who live in them."
          </p>
          <p className="text-[10px] text-sidebar-foreground/50 mt-2">— David Hicks</p>
        </div>
      )}

      {/* Collapse Toggle - desktop only */}
      {!isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(
            "absolute -right-3 top-20 w-6 h-6 rounded-full",
            "bg-card border border-border shadow-soft",
            "hover:bg-accent text-muted-foreground hover:text-foreground",
            "transition-transform duration-200",
            "hidden lg:flex"
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </Button>
      )}
    </aside>
  );
}
