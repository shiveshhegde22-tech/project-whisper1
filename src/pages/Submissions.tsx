import { useState, useEffect } from 'react';
import { Submission, getSubmissions, updateSubmissionStatus, updateSubmissionNotes } from '@/lib/submissionsService';
import { SubmissionsTable } from '@/components/submissions/SubmissionsTable';
import { SubmissionDetailModal } from '@/components/dashboard/SubmissionDetailModal';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function Submissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const { toast } = useToast();

  const fetchSubmissions = async () => {
    try {
      const data = await getSubmissions();
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Failed to load submissions.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleStatusChange = async (id: string, newStatus: Submission['status']) => {
    try {
      await updateSubmissionStatus(id, newStatus);
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive"
      });
    }
  };

  const handleAddNote = async (id: string, note: string) => {
    try {
      const submission = submissions.find(s => s.id === id);
      const notes = submission?.notes ? `${submission.notes}\n${note}` : note;
      await updateSubmissionNotes(id, notes);
      setSubmissions(prev => prev.map(sub => 
        sub.id === id ? { ...sub, notes } : sub
      ));
      setSelectedSubmission(prev => 
        prev?.id === id ? { ...prev, notes } : prev
      );
      toast({
        title: "Note added",
        description: "Your note has been saved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save note.",
        variant: "destructive"
      });
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
