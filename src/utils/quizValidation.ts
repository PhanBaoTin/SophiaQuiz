import type { QuizInput, Question } from "../types/quiz";

export type QuizErrors = Partial<Record<"title" | "thinkingTime" | "questions", string>>;

export function validateQuestion(question: Question): string | null {
  if (!question.text.trim()) return "Hãy nhập nội dung câu hỏi.";
  if (question.options.some((option) => !option.text.trim())) return "Hãy điền đủ cả bốn đáp án.";
  if (!question.options.some((option) => option.id === question.correctOptionId)) return "Hãy chọn đáp án đúng.";
  return null;
}

export function validateQuiz(input: QuizInput): QuizErrors {
  const errors: QuizErrors = {};
  if (!input.title.trim()) errors.title = "Tên bộ câu hỏi không được để trống.";
  else if (input.title.trim().length > 80) errors.title = "Tên bộ câu hỏi tối đa 80 ký tự.";
  if (!Number.isInteger(input.thinkingTime) || input.thinkingTime < 5 || input.thinkingTime > 120) {
    errors.thinkingTime = "Thời gian phải là số nguyên từ 5 đến 120 giây.";
  }
  if (input.questions.length === 0) errors.questions = "Thêm ít nhất một câu hỏi để xuất bản.";
  else if (input.questions.some((question) => validateQuestion(question))) {
    errors.questions = "Kiểm tra lại nội dung và bốn đáp án của từng câu hỏi.";
  }
  return errors;
}
