import { useMemo } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { QuizOption, QuizQuestion } from '@/types/quiz';

export interface ParsedQuizQuestion extends Omit<QuizQuestion, 'options'> {
  parsedOptions: QuizOption[];
}

function parseQuestions(data: QuizQuestion[] | null): ParsedQuizQuestion[] {
  if (!data) return [];

  return data.map((question) => {
    let parsedOptions: QuizOption[] = [];

    try {
      parsedOptions = JSON.parse(question.options);
    } catch {
      console.error('Erro ao converter opções', question.code);
    }

    return { ...question, parsedOptions };
  });
}

export function useQuizQuestions(animalId: string | undefined) {
  const path = animalId ? `/quiz/list?animalId=${animalId}` : null;
  const { data, loading, error, errorStatus, refetch } = useFetch<QuizQuestion[]>(path);

  const questions = useMemo(() => parseQuestions(data), [data]);

  return {
    questions,
    loading,
    error,
    errorStatus,
    refetch,
  };
}
