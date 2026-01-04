export type SubmissionStatus = 'new' | 'replied' | 'archived';

export interface Submission {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  projectType: string;
  budgetRange: string;
  projectDetails: string;
  status: SubmissionStatus;
  createdAt: Date;
  notes: string[];
}

const projectTypes = ['3BHK Apartment', 'Villa', 'Renovation', '2BHK Apartment', 'Penthouse', 'Commercial Office', 'Studio Apartment'];
const budgetRanges = ['₹20L - ₹30L', '₹30L - ₹50L', '₹50L - ₹75L', '₹75L - ₹1Cr', '₹1Cr - ₹2Cr', '₹2Cr+'];

const firstNames = ['Priya', 'Rahul', 'Ananya', 'Vikram', 'Neha', 'Arjun', 'Kavita', 'Sanjay', 'Meera', 'Rohan', 'Aditi', 'Arun'];
const lastNames = ['Sharma', 'Patel', 'Mehta', 'Gupta', 'Singh', 'Kapoor', 'Joshi', 'Reddy', 'Nair', 'Malhotra', 'Iyer', 'Rao'];

const projectDetailsTemplates = [
  "Looking to redesign our living space with a modern minimalist approach. We want to incorporate natural materials and create an open, airy feel throughout the home.",
  "Planning a complete renovation of our family villa. We need a contemporary design that respects traditional elements while being functional for a family of four.",
  "Interested in transforming our apartment into a luxury living space. We love the Scandinavian aesthetic with warm wood tones and clean lines.",
  "Seeking an elegant design for our new penthouse. We want a sophisticated look with custom furniture and premium finishes throughout.",
  "Need help designing our home office space within our apartment. Looking for a professional yet comfortable environment for remote work.",
  "Planning to renovate our kitchen and living area. We want an open concept design with a modern kitchen island and integrated dining space.",
  "Looking for help with our entire home interior. We prefer earthy tones, sustainable materials, and a calming atmosphere.",
  "Want to create a luxury master bedroom suite with walk-in closet and spa-like bathroom. Budget is flexible for premium quality.",
];

function generateRandomDate(daysBack: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  date.setHours(Math.floor(Math.random() * 14) + 8);
  date.setMinutes(Math.floor(Math.random() * 60));
  return date;
}

function generatePhoneNumber(): string {
  const prefixes = ['98', '99', '97', '96', '95', '94', '93', '91', '90', '88', '87', '86', '85', '84', '83', '82', '81', '80', '79', '78', '77', '76', '75', '74', '73', '72', '71', '70'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const rest = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  return `+91 ${prefix}${rest.slice(0, 3)} ${rest.slice(3, 5)}${rest.slice(5)}`;
}

export function generateMockSubmissions(count: number = 25): Submission[] {
  const submissions: Submission[] = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const daysBack = Math.floor(Math.random() * 90);
    const status: SubmissionStatus = daysBack < 7 
      ? (Math.random() > 0.6 ? 'new' : 'replied')
      : (Math.random() > 0.3 ? 'replied' : (Math.random() > 0.5 ? 'archived' : 'new'));
    
    submissions.push({
      id: `sub_${Date.now()}_${i}`,
      fullName: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'][Math.floor(Math.random() * 4)]}`,
      phone: generatePhoneNumber(),
      projectType: projectTypes[Math.floor(Math.random() * projectTypes.length)],
      budgetRange: budgetRanges[Math.floor(Math.random() * budgetRanges.length)],
      projectDetails: projectDetailsTemplates[Math.floor(Math.random() * projectDetailsTemplates.length)],
      status,
      createdAt: generateRandomDate(daysBack),
      notes: status === 'replied' ? ['Sent initial response', 'Scheduled consultation call'] : [],
    });
  }
  
  return submissions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export const mockSubmissions = generateMockSubmissions(30);

export function getSubmissionStats(submissions: Submission[]) {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const total = submissions.length;
  const newLastWeek = submissions.filter(s => s.createdAt >= sevenDaysAgo).length;
  const newSubmissions = submissions.filter(s => s.status === 'new').length;
  const repliedSubmissions = submissions.filter(s => s.status === 'replied').length;
  const archivedSubmissions = submissions.filter(s => s.status === 'archived').length;
  
  const budgetCounts: Record<string, number> = {};
  const projectTypeCounts: Record<string, number> = {};
  
  submissions.forEach(s => {
    budgetCounts[s.budgetRange] = (budgetCounts[s.budgetRange] || 0) + 1;
    projectTypeCounts[s.projectType] = (projectTypeCounts[s.projectType] || 0) + 1;
  });
  
  // Calculate submissions per week for the last 8 weeks
  const weeklyData: { week: string; count: number }[] = [];
  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
    const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    const count = submissions.filter(s => s.createdAt >= weekStart && s.createdAt < weekEnd).length;
    weeklyData.push({
      week: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count,
    });
  }
  
  return {
    total,
    newLastWeek,
    newSubmissions,
    repliedSubmissions,
    archivedSubmissions,
    budgetCounts,
    projectTypeCounts,
    weeklyData,
    avgBudget: '₹50L - ₹75L', // Simplified for mock
    responseRate: Math.round((repliedSubmissions / total) * 100),
  };
}
