import { mockSubmissions, getSubmissionStats } from '@/lib/mockData';
import { StatCard } from '@/components/dashboard/StatCard';
import { SubmissionsChart } from '@/components/dashboard/SubmissionsChart';
import { ProjectTypeChart } from '@/components/analytics/ProjectTypeChart';
import { BudgetChart } from '@/components/analytics/BudgetChart';
import { TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';

export default function Analytics() {
  const stats = getSubmissionStats(mockSubmissions);

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
          value={stats.newSubmissions}
          subtitle="Awaiting response"
          icon={Clock}
        />
        <StatCard
          title="Replied"
          value={stats.repliedSubmissions}
          icon={CheckCircle}
        />
        <StatCard
          title="Response Rate"
          value={`${stats.responseRate}%`}
          icon={TrendingUp}
        />
      </div>

      {/* Trend Chart */}
      <SubmissionsChart data={stats.weeklyData} />

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectTypeChart data={stats.projectTypeCounts} />
        <BudgetChart data={stats.budgetCounts} />
      </div>

      {/* Monthly Insights */}
      <div className="card-elevated p-6">
        <h3 className="font-display text-lg font-semibold mb-4">Monthly Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 rounded-lg bg-muted/30">
            <p className="text-3xl font-display font-semibold text-primary">{Math.round(stats.total / 3)}</p>
            <p className="text-sm text-muted-foreground mt-1">Avg. Monthly Submissions</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/30">
            <p className="text-3xl font-display font-semibold text-primary">24h</p>
            <p className="text-sm text-muted-foreground mt-1">Avg. Response Time</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted/30">
            <p className="text-3xl font-display font-semibold text-primary">Villa</p>
            <p className="text-sm text-muted-foreground mt-1">Most Popular Project</p>
          </div>
        </div>
      </div>
    </div>
  );
}
