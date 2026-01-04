import { supabase } from "@/integrations/supabase/client";

export interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budgetRange: string;
  projectDetails: string;
  status: 'new' | 'replied' | 'archived';
  submittedAt: Date;
  notes?: string;
}

// Get all submissions
export const getSubmissions = async (): Promise<Submission[]> => {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .order('submitted_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching submissions:", error);
    return [];
  }
  
  return (data || []).map(item => ({
    id: item.id,
    name: item.name,
    email: item.email,
    phone: item.phone,
    projectType: item.project_type,
    budgetRange: item.budget_range,
    projectDetails: item.project_details || '',
    status: item.status as 'new' | 'replied' | 'archived',
    submittedAt: new Date(item.submitted_at),
    notes: item.notes || undefined
  }));
};

// Update submission status
export const updateSubmissionStatus = async (id: string, status: Submission['status']): Promise<void> => {
  const { error } = await supabase
    .from('submissions')
    .update({ status })
    .eq('id', id);
  
  if (error) {
    console.error("Error updating status:", error);
    throw new Error("Failed to update submission status.");
  }
};

// Update submission notes
export const updateSubmissionNotes = async (id: string, notes: string): Promise<void> => {
  const { error } = await supabase
    .from('submissions')
    .update({ notes })
    .eq('id', id);
  
  if (error) {
    console.error("Error updating notes:", error);
    throw new Error("Failed to update submission notes.");
  }
};

// Get submission stats
export const getSubmissionStats = (submissions: Submission[]) => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const newSubmissions = submissions.filter(s => s.submittedAt >= sevenDaysAgo);
  
  const budgetValues: Record<string, number> = {
    "₹10L - 30L": 20,
    "₹30L - 50L": 40,
    "₹50L - 1CR": 75,
    "₹1CR - 2CR": 150,
    "₹2CR+": 250,
  };
  
  const avgBudget = submissions.length > 0
    ? submissions.reduce((acc, s) => acc + (budgetValues[s.budgetRange] || 50), 0) / submissions.length
    : 0;
  
  return {
    total: submissions.length,
    newCount: newSubmissions.length,
    avgBudget: `₹${avgBudget.toFixed(0)}L avg`
  };
};
