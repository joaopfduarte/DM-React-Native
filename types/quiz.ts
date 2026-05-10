export interface QuizOption {
  id: number;
  value: string;
}

export interface QuizQuestion {
  statement: string;
  options: string;
  code: number;
}

export interface QuizAnswerPayload {
  questionCode: number;
  userAnswer: number;
}