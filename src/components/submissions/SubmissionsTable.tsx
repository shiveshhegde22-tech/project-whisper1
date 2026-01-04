import { useState, useMemo, useEffect } from 'react';
import { Submission } from '@/lib/submissionsService';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSearch } from '@/contexts/SearchContext';
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
import { Search, Download, Eye, X } from 'lucide-react';

type SubmissionStatus = 'new' | 'replied' | 'archived';

interface SubmissionsTableProps {
  submissions: Submission[];
  onViewSubmission: (submission: Submission) => void;
}

export function SubmissionsTable({ submissions, onViewSubmission }: SubmissionsTableProps) {
  const { searchQuery: globalSearchQuery, setSearchQuery: setGlobalSearchQuery } = useSearch();
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>('all');
  const [projectTypeFilter, setProjectTypeFilter] = useState<string>('all');

  // Sync local search with global search
  useEffect(() => {
    if (globalSearchQuery) {
      setLocalSearchQuery(globalSearchQuery);
    }
  }, [globalSearchQuery]);

  const searchQuery = localSearchQuery || globalSearchQuery;

  const projectTypes = useMemo(() => {
    return Array.from(new Set(submissions.map(s => s.projectType)));
  }, [submissions]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter(sub => {
      const matchesSearch = 
        searchQuery === '' ||
        sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
      const matchesProjectType = projectTypeFilter === 'all' || sub.projectType === projectTypeFilter;
      
      return matchesSearch && matchesStatus && matchesProjectType;
    });
  }, [submissions, searchQuery, statusFilter, projectTypeFilter]);

  const handleExportCSV = () => {
    const headers = ['Date', 'Name', 'Email', 'Phone', 'Project Type', 'Budget', 'Status', 'Details'];
    const rows = filteredSubmissions.map(sub => [
      format(sub.submittedAt, 'yyyy-MM-dd HH:mm'),
      sub.name,
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
    setLocalSearchQuery('');
    setGlobalSearchQuery('');
    setStatusFilter('all');
    setProjectTypeFilter('all');
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || projectTypeFilter !== 'all';

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or email..."
            value={localSearchQuery}
            onChange={(e) => {
              setLocalSearchQuery(e.target.value);
              setGlobalSearchQuery(e.target.value);
            }}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as SubmissionStatus | 'all')}>
            <SelectTrigger className="w-full xs:w-[120px] sm:w-[140px]">
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
            <SelectTrigger className="w-full xs:w-[140px] sm:w-[160px]">
              <SelectValue placeholder="Project Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {projectTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2 ml-auto">
            {hasActiveFilters && (
              <Button variant="ghost" size="icon" onClick={clearFilters}>
                <X className="w-4 h-4" />
              </Button>
            )}
            <Button variant="outline" onClick={handleExportCSV} size="icon" className="sm:w-auto sm:px-3">
              <Download className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredSubmissions.length} of {submissions.length} submissions
      </p>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground card-elevated">
            No submissions found matching your filters
          </div>
        ) : (
          filteredSubmissions.map((submission, index) => (
            <div
              key={submission.id}
              className="card-elevated p-4 cursor-pointer hover:bg-accent/50 transition-colors animate-fade-in"
              style={{ animationDelay: `${index * 20}ms` }}
              onClick={() => onViewSubmission(submission)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{submission.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{submission.email}</p>
                </div>
                <StatusBadge status={submission.status} />
              </div>
              <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                <span>{submission.projectType}</span>
                <span>{format(submission.submittedAt, 'MMM d')}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table */}
      <div className="card-elevated overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden lg:table-cell">Email</TableHead>
                <TableHead className="hidden xl:table-cell">Project Type</TableHead>
                <TableHead className="hidden xl:table-cell">Budget</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
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
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {format(submission.submittedAt, 'MMM d')}
                    </TableCell>
                    <TableCell className="font-medium">{submission.name}</TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground truncate max-w-[200px]">
                      {submission.email}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">{submission.projectType}</TableCell>
                    <TableCell className="hidden xl:table-cell text-muted-foreground">
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
    </div>
  );
}
