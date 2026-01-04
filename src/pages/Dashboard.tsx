import { useState } from 'react';
import { mockSubmissions, getSubmissionStats, Submission, SubmissionStatus } from '@/lib/mockData';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentSubmissions } from '@/components/dashboard/RecentSubmissions';
import { SubmissionsChart } from '@/components/dashboard/SubmissionsChart';
import { SubmissionDetailModal } from '@/components/dashboard/SubmissionDetailModal';
import { Inbox, Clock, TrendingUp, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const [submissions, setSubmissions] = useState(mockSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const { toast } = useToast();

  const stats = getSubmissionStats(submissions);

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
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Submissions"
          value={stats.total}
          subtitle="All time inquiries"
          icon={Inbox}
        />
        <StatCard
          title="New This Week"
          value={stats.newLastWeek}
          subtitle="Last 7 days"
          icon={Clock}
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Response Rate"
          value={`${stats.responseRate}%`}
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SubmissionsChart data={stats.weeklyData} />
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
