import { QuizAnswerPayload, QuizQuestion } from "@/types/quiz";
import api from "./api";

export async function getQuizByAnimalId(animalId: number) {
  const response = await api.get<QuizQuestion[]>("/quiz/list", {
    params: { animalId: animalId.toString() },
  });
  return response.data;
}

export async function submitAnswer(payload: QuizAnswerPayload) {
  const response = await api.post<any>("/quiz/answer", payload, {});

  return response.data;
}
