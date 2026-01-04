import { useState, useEffect } from 'react';
import { Submission, getSubmissions, getSubmissionStats } from '@/lib/submissionsService';
import { StatCard } from '@/components/dashboard/StatCard';
import { SubmissionsChart } from '@/components/dashboard/SubmissionsChart';
import { ProjectTypeChart } from '@/components/analytics/ProjectTypeChart';
import { BudgetChart } from '@/components/analytics/BudgetChart';
import { TrendingUp, Users, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { generateWeeklyData, generateProjectTypeCounts, generateBudgetCounts } from '@/lib/mockData';

export default function Analytics() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSubmissions();
        setSubmissions(data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = getSubmissionStats(submissions);
  const weeklyData = generateWeeklyData(submissions);
  const projectTypeCounts = generateProjectTypeCounts(submissions);
  const budgetCounts = generateBudgetCounts(submissions);

  const newSubmissions = submissions.filter(s => s.status === 'new').length;
  const repliedSubmissions = submissions.filter(s => s.status === 'replied').length;
  const responseRate = submissions.length > 0 ? Math.round((repliedSubmissions / submissions.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-display text-2xl font-semibold">Analytics</h2>
        <p className="text-muted-foreground mt-1">Insights and trends from your submissions</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Inquiries"
          value={stats.total}
          icon={Users}
        />
        <StatCard
          title="New Submissions"
          value={newSubmissions}
          subtitle="Awaiting response"
          icon={Clock}
        />
        <StatCard
          title="Replied"
          value={repliedSubmissions}
          icon={CheckCircle}
        />
        <StatCard
          title="Response Rate"
          value={`${responseRate}%`}
          icon={TrendingUp}
        />
      </div>

      {/* Trend Chart */}
      <SubmissionsChart data={weeklyData} />

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectTypeChart data={projectTypeCounts} />
        <BudgetChart data={budgetCounts} />
      </div>

      {/* Monthly Insights */}
      <div className="card-elevated p-6">
        <h3 className="font-display text-lg font-semibold mb-4">Monthly Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 rounded-lg bg-muted/30">
            <p className="text-3xl font-display font-semibold text-primary">{Math.round(stats.total / 3) || 0}</p>
            <p className="text-sm text-muted-foreground mt-1">Avg. Monthly Submissions</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/30">
            <p className="text-3xl font-display font-semibold text-primary">24h</p>
            <p className="text-sm text-muted-foreground mt-1">Avg. Response Time</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/30">
            <p className="text-3xl font-display font-semibold text-primary">
              {Object.keys(projectTypeCounts).length > 0 
                ? Object.entries(projectTypeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] 
                : 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Most Popular Project</p>
          </div>
        </div>
      </div>
    </div>
  );
}
