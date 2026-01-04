import { Submission } from '@/lib/submissionsService';
import { StatusBadge } from './StatusBadge';
import { formatDistanceToNow } from 'date-fns';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecentSubmissionsProps {
  submissions: Submission[];
  onViewSubmission: (submission: Submission) => void;
}

export function RecentSubmissions({ submissions, onViewSubmission }: RecentSubmissionsProps) {
  const recentFive = submissions.slice(0, 5);

  return (
    <div className="card-elevated overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-border">
        <h3 className="font-display text-base sm:text-lg font-semibold">Recent Submissions</h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Latest project inquiries</p>
      </div>
      <div className="divide-y divide-border">
        {recentFive.map((submission, index) => (
          <div 
            key={submission.id} 
            className="p-3 sm:p-4 flex items-center justify-between gap-2 table-row-hover animate-slide-up cursor-pointer"
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => onViewSubmission(submission)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <span className="text-xs sm:text-sm font-medium text-accent-foreground">
                    {submission.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{submission.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {submission.projectType}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="text-right">
                <StatusBadge status={submission.status} />
                <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
                  {formatDistanceToNow(submission.submittedAt, { addSuffix: true })}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewSubmission(submission);
                }}
                className="h-8 w-8 hidden sm:flex"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {recentFive.length === 0 && (
          <div className="p-6 sm:p-8 text-center text-muted-foreground">
            No submissions yet
          </div>
        )}
      </div>
    </div>
  );
}
