import { v4 as uuidv4 } from 'uuid';

export function generateInterviewId(): string {
  return uuidv4();
}

export function createInterviewUrl(
  candidateName: string,
  interviewer1: string,
  interviewer2: string,
  existingId?: string
): string {
  const id = existingId || generateInterviewId();
  const params = new URLSearchParams({
    id,
    candidate: candidateName,
    interviewer1,
    interviewer2
  });
  
  return `/competence?${params.toString()}`;
}

export function parseInterviewParams(searchParams: URLSearchParams) {
  return {
    id: searchParams.get('id') || '',
    candidateName: searchParams.get('candidate') || '',
    interviewer1: searchParams.get('interviewer1') || '',
    interviewer2: searchParams.get('interviewer2') || ''
  };
}

export function calculateAverage(scores: (number | null)[]): number | null {
  const validScores = scores.filter((score): score is number => score !== null);
  if (validScores.length === 0) return null;
  
  const sum = validScores.reduce((acc, score) => acc + score, 0);
  return Math.round((sum / validScores.length) * 100) / 100; // Round to 2 decimal places
}
