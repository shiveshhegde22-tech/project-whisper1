import { useState, useMemo } from 'react';
import { Submission, SubmissionStatus } from '@/lib/mockData';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { Search, Download, Eye, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubmissionsTableProps {
  submissions: Submission[];
  onViewSubmission: (submission: Submission) => void;
}

export function SubmissionsTable({ submissions, onViewSubmission }: SubmissionsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>('all');
  const [projectTypeFilter, setProjectTypeFilter] = useState<string>('all');

  const projectTypes = useMemo(() => {
    return Array.from(new Set(submissions.map(s => s.projectType)));
  }, [submissions]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter(sub => {
      const matchesSearch = 
        searchQuery === '' ||
        sub.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
      const matchesProjectType = projectTypeFilter === 'all' || sub.projectType === projectTypeFilter;
      
      return matchesSearch && matchesStatus && matchesProjectType;
    });
  }, [submissions, searchQuery, statusFilter, projectTypeFilter]);

  const handleExportCSV = () => {
    const headers = ['Date', 'Name', 'Email', 'Phone', 'Project Type', 'Budget', 'Status', 'Details'];
    const rows = filteredSubmissions.map(sub => [
      format(sub.createdAt, 'yyyy-MM-dd HH:mm'),
      sub.fullName,
      sub.email,
      sub.phone,
      sub.projectType,
      sub.budgetRange,
      sub.status,
      sub.projectDetails.replace(/,/g, ';')
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setProjectTypeFilter('all');
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || projectTypeFilter !== 'all';

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as SubmissionStatus | 'all')}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="replied">Replied</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select value={projectTypeFilter} onValueChange={setProjectTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Project Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {projectTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button variant="ghost" size="icon" onClick={clearFilters}>
              <X className="w-4 h-4" />
            </Button>
          )}
          <Button variant="outline" onClick={handleExportCSV} className="gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredSubmissions.length} of {submissions.length} submissions
      </p>

      {/* Table */}
      <div className="card-elevated overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Project Type</TableHead>
              <TableHead className="hidden lg:table-cell">Budget</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  No submissions found matching your filters
                </TableCell>
              </TableRow>
            ) : (
              filteredSubmissions.map((submission, index) => (
                <TableRow 
                  key={submission.id}
                  className="table-row-hover cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 20}ms` }}
                  onClick={() => onViewSubmission(submission)}
                >
                  <TableCell className="text-sm text-muted-foreground">
                    {format(submission.createdAt, 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="font-medium">{submission.fullName}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {submission.email}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{submission.projectType}</TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {submission.budgetRange}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={submission.status} />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
