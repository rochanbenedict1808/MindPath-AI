
export interface EmotionData {
  // Added index signature to resolve Recharts Type error in components/Charts.tsx
  [key: string]: string | number;
  name: string;
  value: number;
}

export interface TrendData {
  // Added index signature to resolve Recharts Type error in components/Charts.tsx
  [key: string]: number;
  segment: number;
  sentiment: number; // -1 to 1
  intensity: number; // 0 to 1
}

export interface CareerRecommendation {
  domain: string;
  reason: string;
  matchScore: number;
  keySkills: string[];
  roadmap: string[];
}

export interface AssessmentResult {
  stressIndex: number;
  engagementScore: number;
  emotionalResilience: number;
  emotions: EmotionData[];
  trends: TrendData[];
  interestClusters: string[];
  careerGuidance: CareerRecommendation[];
  explainability: {
    featureImportance: { feature: string; weight: number }[];
    summary: string;
  };
}

export enum AppState {
  LANDING = 'LANDING',
  INPUT = 'INPUT',
  LOADING = 'LOADING',
  DASHBOARD = 'DASHBOARD'
}