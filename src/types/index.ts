export interface InterviewData {
  id: string;
  candidateName: string;
  interviewer1: string;
  interviewer2: string;
  specialization: 'manual' | 'automation' | null;
  automationTools: ('selenium' | 'cypress' | 'playwright')[];
  skills: SkillScore[];
  comments: CategoryComment[];
}

export interface SkillScore {
  skillId: string;
  interviewer1Score: number | null; // null means N/A
  interviewer2Score: number | null;
}

export interface CategoryComment {
  categoryId: string;
  interviewer1Comment: string;
  interviewer2Comment: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  applicableTo: ('manual' | 'selenium' | 'cypress' | 'playwright')[];
  description?: string[];
}

export interface Category {
  id: string;
  name: string;
  applicableTo: ('manual' | 'selenium' | 'cypress' | 'playwright')[];
}

export interface InterviewSession {
  id: string;
  data: InterviewData;
  lastUpdated: Date;
}
