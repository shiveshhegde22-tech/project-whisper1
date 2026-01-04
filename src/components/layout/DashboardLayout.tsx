import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';
import { cn } from '@/lib/utils';

export function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen flex w-full bg-background relative">
      {/* Mobile overlay */}
      {isMobile && !sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
      
      <DashboardSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={handleSidebarToggle}
        isMobile={isMobile}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader 
          onMenuClick={handleSidebarToggle}
          sidebarCollapsed={sidebarCollapsed}
        />
        <main className={cn(
          "flex-1 p-4 sm:p-6 overflow-auto",
          isMobile && "pb-20"
        )}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
