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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                <span className="text-lg font-medium text-accent-foreground">
                  {submission.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <DialogTitle className="font-display text-xl">
                  {submission.name}
                </DialogTitle>
                <StatusBadge status={submission.status} />
              </div>
            </div>
            <div className="flex items-center gap-1">
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

        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {details.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium">{value}</p>
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
            <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-4">
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
            <div className="flex gap-2">
              <Textarea
                placeholder="Add a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="text-sm resize-none"
                rows={2}
              />
              <Button 
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                size="sm"
                className="self-end"
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center justify-between pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="flex gap-2">
            {submission.status !== 'replied' && (
              <Button 
                variant="default"
                onClick={() => onStatusChange(submission.id, 'replied')}
                className="gap-2"
              >
                <Reply className="w-4 h-4" />
                Mark as Replied
              </Button>
            )}
            {submission.status !== 'archived' && (
              <Button 
                variant="secondary"
                onClick={() => onStatusChange(submission.id, 'archived')}
                className="gap-2"
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
