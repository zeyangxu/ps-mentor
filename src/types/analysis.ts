export interface AnalysisResponse {
  scores: {
    [key: string]: number;
  };
  feedback: {
    [key: string]: string;
  };
  overall_score: number;
  overall_feedback: string;
}