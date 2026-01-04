import { Submission } from '@/lib/submissionsService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge } from './StatusBadge';
import { format } from 'date-fns';
import { 
  Mail, 
  Phone, 
  Home, 
  Wallet, 
  Calendar, 
  MessageSquare,
  Reply,
  Archive,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

interface SubmissionDetailModalProps {
  submission: Submission | null;
  onClose: () => void;
  onStatusChange: (id: string, status: Submission['status']) => void;
  onAddNote: (id: string, note: string) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export function SubmissionDetailModal({ 
  submission, 
  onClose, 
  onStatusChange,
  onAddNote,
  onNavigate,
  hasPrev,
  hasNext
}: SubmissionDetailModalProps) {
  const [newNote, setNewNote] = useState('');

  if (!submission) return null;

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(submission.id, newNote.trim());
      setNewNote('');
    }
  };

  const details = [
    { icon: Mail, label: 'Email', value: submission.email },
    { icon: Phone, label: 'Phone', value: submission.phone },
    { icon: Home, label: 'Project Type', value: submission.projectType },
    { icon: Wallet, label: 'Budget Range', value: submission.budgetRange },
    { icon: Calendar, label: 'Submitted', value: format(submission.submittedAt, 'PPP p') },
  ];

  const notesArray = submission.notes ? submission.notes.split('\n').filter(n => n.trim()) : [];

  return (
    <Dialog open={!!submission} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] w-[calc(100%-2rem)] sm:w-full overflow-hidden flex flex-col p-4 sm:p-6">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                <span className="text-sm sm:text-lg font-medium text-accent-foreground">
                  {submission.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="min-w-0">
                <DialogTitle className="font-display text-base sm:text-xl truncate">
                  {submission.name}
                </DialogTitle>
                <StatusBadge status={submission.status} />
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavigate('prev')}
                disabled={!hasPrev}
                className="h-8 w-8"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavigate('next')}
                disabled={!hasNext}
                className="h-8 w-8"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4 sm:space-y-6">
          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {details.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Project Details */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              Project Details
            </h4>
            <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 sm:p-4">
              {submission.projectDetails}
            </p>
          </div>

          {/* Internal Notes */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Internal Notes</h4>
            {notesArray.length > 0 ? (
              <div className="space-y-2">
                {notesArray.map((note, index) => (
                  <div 
                    key={index} 
                    className="text-sm bg-accent/50 rounded-lg px-3 py-2 text-accent-foreground"
                  >
                    {note}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No notes yet</p>
            )}
            <div className="flex flex-col sm:flex-row gap-2">
              <Textarea
                placeholder="Add a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="text-sm resize-none flex-1"
                rows={2}
              />
              <Button 
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                size="sm"
                className="sm:self-end"
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Close
          </Button>
          <div className="flex flex-col sm:flex-row gap-2">
            {submission.status !== 'replied' && (
              <Button 
                variant="default"
                onClick={() => onStatusChange(submission.id, 'replied')}
                className="gap-2 w-full sm:w-auto"
              >
                <Reply className="w-4 h-4" />
                <span className="sm:inline">Mark Replied</span>
              </Button>
            )}
            {submission.status !== 'archived' && (
              <Button 
                variant="secondary"
                onClick={() => onStatusChange(submission.id, 'archived')}
                className="gap-2 w-full sm:w-auto"
              >
                <Archive className="w-4 h-4" />
                Archive
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
