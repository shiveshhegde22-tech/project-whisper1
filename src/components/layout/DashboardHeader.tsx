import { Menu, Bell, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { Submission } from '@/lib/firebaseSubmissionsService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DashboardHeaderProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
}

export function DashboardHeader({ onMenuClick, sidebarCollapsed }: DashboardHeaderProps) {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [newSubmissions, setNewSubmissions] = useState<Submission[]>([]);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Real-time listener for new submissions
  useEffect(() => {
    const submissionsRef = collection(db, 'contacts');
    const q = query(
      submissionsRef,
      where('status', '==', 'new'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const submissions: Submission[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          projectType: data.projectType || '',
          budgetRange: data.budget || data.budgetRange || '',
          projectDetails: data.message || data.projectDetails || '',
          status: 'new' as const,
          submittedAt: data.createdAt?.toDate?.() || new Date(),
          notes: data.notes
        };
      });
      
      // Show toast if there's a new submission (only after initial load)
      if (newSubmissions.length > 0 && submissions.length > newSubmissions.length) {
        const newest = submissions[0];
        toast({
          title: "🔔 New Submission",
          description: `${newest.name} just submitted a contact request`,
        });
      }
      
      setNewSubmissions(submissions);
    }, (error) => {
      console.error("Error listening to submissions:", error);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign out.",
        variant: "destructive"
      });
    }
  };

  const handleViewSubmission = (id: string) => {
    setNotificationOpen(false);
    navigate('/submissions');
  };

  const userInitials = user?.displayName
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <header className="h-14 sm:h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-3 sm:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden flex-shrink-0"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div className="min-w-0">
          <h1 className="font-display text-base sm:text-xl font-semibold text-foreground truncate">
            Contact Dashboard
          </h1>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Manage and track all your project inquiries
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        
        <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {newSubmissions.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="p-3 border-b border-border">
              <h4 className="font-semibold text-sm">Notifications</h4>
              <p className="text-xs text-muted-foreground">
                {newSubmissions.length} new submission{newSubmissions.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {newSubmissions.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No new submissions
                </div>
              ) : (
                newSubmissions.map((submission) => (
                  <button
                    key={submission.id}
                    onClick={() => handleViewSubmission(submission.id)}
                    className="w-full p-3 hover:bg-muted/50 border-b border-border last:border-0 text-left transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{submission.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{submission.projectType}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {submission.submittedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
            {newSubmissions.length > 0 && (
              <div className="p-2 border-t border-border">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-xs"
                  onClick={() => {
                    setNotificationOpen(false);
                    navigate('/submissions');
                  }}
                >
                  View all submissions
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full p-0">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'User'} 
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs sm:text-sm font-medium text-primary">{userInitials}</span>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.displayName || 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
