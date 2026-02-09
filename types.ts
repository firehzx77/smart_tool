
export interface SmartQuestions {
  specific: string[];
  measurable: string[];
  actionOriented: string[];
  relevant: string[];
  timeBound: string[];
}

export interface CriticalQuestion {
  question: string;
  reasoning: string;
}

export interface NegativeExample {
  question: string;
  reasoning: string;
}

export interface CoachResponse {
  summary: string;
  smartQuestions: SmartQuestions;
  critique: {
    shortcomings: string[];
    criticalQuestion: CriticalQuestion;
    negativeExample: NegativeExample;
  };
}

export interface CoachingSession {
  id: string;
  timestamp: number;
  background: string;
  originalQuestion: string;
  response: CoachResponse;
}
