import { SubmissionStatus } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: SubmissionStatus;
}

const statusConfig: Record<SubmissionStatus, { label: string; className: string }> = {
  new: { 
    label: 'New', 
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
  },
  replied: { 
    label: 'Replied', 
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
  },
  archived: { 
    label: 'Archived', 
    className: 'bg-muted text-muted-foreground' 
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={cn(
      "status-badge",
      config.className
    )}>
      {config.label}
    </span>
  );
}
