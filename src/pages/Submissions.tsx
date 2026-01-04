import { useState } from 'react';
import { mockSubmissions, Submission, SubmissionStatus } from '@/lib/mockData';
import { SubmissionsTable } from '@/components/submissions/SubmissionsTable';
import { SubmissionDetailModal } from '@/components/dashboard/SubmissionDetailModal';
import { useToast } from '@/hooks/use-toast';

export default function Submissions() {
  const [submissions, setSubmissions] = useState(mockSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const { toast } = useToast();

  const handleStatusChange = (id: string, newStatus: SubmissionStatus) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, status: newStatus } : sub
    ));
    setSelectedSubmission(prev => 
      prev?.id === id ? { ...prev, status: newStatus } : prev
    );
    toast({
      title: "Status updated",
      description: `Submission marked as ${newStatus}`,
    });
  };

  const handleAddNote = (id: string, note: string) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, notes: [...sub.notes, note] } : sub
    ));
    setSelectedSubmission(prev => 
      prev?.id === id ? { ...prev, notes: [...prev.notes, note] } : prev
    );
    toast({
      title: "Note added",
      description: "Your note has been saved",
    });
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (!selectedSubmission) return;
    const currentIndex = submissions.findIndex(s => s.id === selectedSubmission.id);
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < submissions.length) {
      setSelectedSubmission(submissions[newIndex]);
    }
  };

  const currentIndex = selectedSubmission 
    ? submissions.findIndex(s => s.id === selectedSubmission.id) 
    : -1;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-display text-2xl font-semibold">All Submissions</h2>
        <p className="text-muted-foreground mt-1">View and manage all project inquiries</p>
      </div>

      <SubmissionsTable 
        submissions={submissions}
        onViewSubmission={setSelectedSubmission}
      />

      <SubmissionDetailModal
        submission={selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        onStatusChange={handleStatusChange}
        onAddNote={handleAddNote}
        onNavigate={handleNavigate}
        hasPrev={currentIndex > 0}
        hasNext={currentIndex < submissions.length - 1}
      />
    </div>
  );
}
