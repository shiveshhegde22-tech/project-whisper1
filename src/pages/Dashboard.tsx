import { useState, useEffect } from 'react';
import { Submission, getFirebaseSubmissions, getFirebaseSubmissionStats, updateFirebaseSubmissionStatus, updateFirebaseSubmissionNotes } from '@/lib/firebaseSubmissionsService';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentSubmissions } from '@/components/dashboard/RecentSubmissions';
import { SubmissionsChart } from '@/components/dashboard/SubmissionsChart';
import { SubmissionDetailModal } from '@/components/dashboard/SubmissionDetailModal';
import { Inbox, Clock, TrendingUp, Wallet, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateWeeklyData } from '@/lib/mockData';

export default function Dashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const { toast } = useToast();

  const fetchSubmissions = async () => {
    try {
      const data = await getFirebaseSubmissions();
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

  const stats = getFirebaseSubmissionStats(submissions);
  const weeklyData = generateWeeklyData(submissions);

  // Calculate response rate
  const repliedCount = submissions.filter(s => s.status === 'replied').length;
  const responseRate = submissions.length > 0 ? Math.round((repliedCount / submissions.length) * 100) : 0;

  const handleStatusChange = async (id: string, newStatus: Submission['status']) => {
    try {
      await updateFirebaseSubmissionStatus(id, newStatus);
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
      await updateFirebaseSubmissionNotes(id, notes);
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
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Submissions"
          value={stats.total}
          subtitle="All time inquiries"
          icon={Inbox}
        />
        <StatCard
          title="New This Week"
          value={stats.newCount}
          subtitle="Last 7 days"
          icon={Clock}
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Response Rate"
          value={`${responseRate}%`}
          subtitle="Replied submissions"
          icon={TrendingUp}
        />
        <StatCard
          title="Avg. Budget"
          value={stats.avgBudget}
          subtitle="Typical project range"
          icon={Wallet}
        />
      </div>

      {/* Charts and Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <SubmissionsChart data={weeklyData} />
        <RecentSubmissions 
          submissions={submissions} 
          onViewSubmission={setSelectedSubmission}
        />
      </div>

      {/* Detail Modal */}
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
