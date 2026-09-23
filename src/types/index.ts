export type DegreeLevel = 'Undergraduate' | "Master's" | 'PhD / Research' | 'Exchange' | 'Fellowship';

export type FundingType = 'Full Ride (Tuition + Living + Travel)' | 'Full Tuition' | 'Partial Tuition' | 'Stipend Only';

export type ScholarshipStatus = 
  | 'Researching'
  | 'Preparing'
  | 'Ready to Apply'
  | 'Applied'
  | 'Interview'
  | 'Waiting'
  | 'Accepted'
  | 'Rejected'
  | 'Withdrawn';

export type RequirementType = 'Document' | 'Essay' | 'Recommendation' | 'Test' | 'Portfolio' | 'Financial' | 'Other';

export type RequirementStatus = 'Not Started' | 'In Progress' | 'Ready' | 'Submitted' | 'Not Required';

export interface ScholarshipRequirement {
  id: string;
  name: string;
  type: RequirementType;
  status: RequirementStatus;
  dueDate?: string;
  linkedDocId?: string;
  notes?: string;
}

export interface Scholarship {
  id: string;
  name: string;
  university?: string;
  organization?: string;
  country: string;
  degreeLevel: DegreeLevel;
  fieldOfStudy: string;
  intake?: string;
  academicYear?: string;
  fundingType: FundingType;
  awardAmount?: string;
  websiteUrl?: string;
  portalUrl?: string;
  deadline: string; // ISO date string (YYYY-MM-DD or full ISO)
  earlyDeadline?: string;
  notificationDate?: string;
  submissionDate?: string;
  status: ScholarshipStatus;
  priority: 'Low' | 'Medium' | 'High';
  notes?: string;
  tags: string[];
  requirements: ScholarshipRequirement[];
  linkedActivityIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export type TaskPriority = 'Low' | 'Medium' | 'High';

export type TaskCategory = 
  | 'Scholarship'
  | 'Documents'
  | 'Essay'
  | 'Recommendation'
  | 'Test'
  | 'Research'
  | 'University'
  | 'Finance'
  | 'Personal'
  | 'General';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  completed: boolean;
  completedAt?: string;
  priority: TaskPriority;
  category: TaskCategory;
  scholarshipId?: string;
  scholarshipName?: string;
  documentId?: string;
  documentName?: string;
  activityId?: string;
  activityTitle?: string;
  requirementId?: string;
  createdAt: string;
  updatedAt: string;
}

export type DocumentCategory = 
  | 'Identity'
  | 'Academic'
  | 'Recommendation'
  | 'Financial'
  | 'Test'
  | 'CV'
  | 'Certificate'
  | 'Portfolio'
  | 'Other';

export type DocumentStatus = 
  | 'Need to Create'
  | 'Need to Collect'
  | 'In Progress'
  | 'Ready'
  | 'Uploaded'
  | 'Expired'
  | 'Not Available';

export interface DocumentItem {
  id: string;
  name: string;
  category: DocumentCategory;
  status: DocumentStatus;
  description?: string;
  fileName?: string;
  fileSize?: number;
  fileUrl?: string;
  filePath?: string;
  issueDate?: string;
  expiryDate?: string;
  notes?: string;
  linkedScholarshipIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type ActivityType = 
  | 'Academic'
  | 'Leadership'
  | 'Volunteering'
  | 'Work Experience'
  | 'Project'
  | 'Research'
  | 'Competition'
  | 'Award'
  | 'Extracurricular'
  | 'Community'
  | 'Other';

export interface ActivityItem {
  id: string;
  title: string;
  type: ActivityType;
  organization: string;
  role: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  impact?: string;
  achievements?: string;
  hoursPerWeek?: number;
  location?: string;
  url?: string;
  linkedScholarshipIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  program: string;
  grade: string;
  startYear: string;
  endYear: string;
  achievements?: string;
}

export interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  languages: string[];
  intendedDegree: string;
  intendedField: string;
  careerGoals: string;
  longTermVision: string;
  whyStudyAbroad: string;
  whyThisField: string;
  education: EducationEntry[];
}

export interface GapYearData {
  whyTookGapYear: string;
  whatAmIDoing: string;
  whatIHaveLearned: string;
  skillsDeveloped: string;
  projectsCompleted: string;
  goalsForYear: string;
}

export interface StorySection {
  id: string;
  title: string;
  content: string;
  promptNotes: string;
  updatedAt: string;
}

export type ActiveNavTab = 'dashboard' | 'todos' | 'scholarships' | 'documents' | 'activities' | 'profile' | 'settings';
