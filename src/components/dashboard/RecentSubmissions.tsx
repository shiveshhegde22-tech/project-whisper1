import { Submission } from '@/lib/mockData';
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
      <div className="p-5 border-b border-border">
        <h3 className="font-display text-lg font-semibold">Recent Submissions</h3>
        <p className="text-sm text-muted-foreground mt-0.5">Latest project inquiries</p>
      </div>
      <div className="divide-y divide-border">
        {recentFive.map((submission, index) => (
          <div 
            key={submission.id} 
            className="p-4 flex items-center justify-between table-row-hover animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-accent-foreground">
                    {submission.fullName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{submission.fullName}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {submission.projectType} • {submission.budgetRange}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <StatusBadge status={submission.status} />
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(submission.createdAt, { addSuffix: true })}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onViewSubmission(submission)}
                className="h-8 w-8"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
