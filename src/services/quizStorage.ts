import type { QuizSet } from "../types/quiz";
import { initialQuizzes } from "../data/initialQuizzes";

const STORAGE_KEY = "sophia.quizSets.v1";
const EDITOR_KEY = "sophia.editorDraft.v1";
const DEMOCRACY_QUIZ_MIGRATION_KEY = "sophia.quizSets.migration.democracy-quiz";
const DEMOCRACY_QUIZ_ID = "xhcn-dan-chu-va-nha-nuoc-phap-quyen";
const REQUESTED_DEMOCRACY_QUIZ_MIGRATION_KEY = "sophia.quizSets.migration.requested-democracy-quiz";
const REQUESTED_DEMOCRACY_QUIZ_ID = "xhcn-dan-chu-va-nha-nuoc-phap-quyen-viet-nam";

function isQuestion(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const question = value as Record<string, unknown>;
  return (
    typeof question.id === "string" &&
    Boolean(question.id) &&
    typeof question.text === "string" &&
    Array.isArray(question.options) &&
    question.options.length === 4 &&
    new Set(question.options.map((option) => option && typeof option === "object" ? (option as Record<string, unknown>).id : null)).size === 4 &&
    question.options.every(
      (option) =>
        option &&
        typeof option === "object" &&
        typeof (option as Record<string, unknown>).id === "string" &&
        Boolean((option as Record<string, unknown>).id) &&
        typeof (option as Record<string, unknown>).text === "string",
    ) &&
    typeof question.correctOptionId === "string" &&
    (!question.correctOptionId || question.options.some((option) => (option as Record<string, unknown>).id === question.correctOptionId))
  );
}

function isQuizSounds(value: unknown): boolean {
  if (value === undefined) return true;
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return Object.entries(value).every(([type, assetId]) =>
    (type === "countdown" || type === "correct" || type === "wrong") &&
    typeof assetId === "string" &&
    Boolean(assetId),
  );
}

function isQuiz(value: unknown): value is QuizSet {
  if (!value || typeof value !== "object") return false;
  const quiz = value as Record<string, unknown>;
  return (
    typeof quiz.id === "string" &&
    Boolean(quiz.id) &&
    typeof quiz.title === "string" &&
    typeof quiz.description === "string" &&
    typeof quiz.category === "string" &&
    typeof quiz.thinkingTime === "number" &&
    (quiz.avatarImageId === undefined || (typeof quiz.avatarImageId === "string" && Boolean(quiz.avatarImageId))) &&
    isQuizSounds(quiz.sounds) &&
    Number.isInteger(quiz.thinkingTime) &&
    quiz.thinkingTime >= 5 &&
    quiz.thinkingTime <= 120 &&
    Array.isArray(quiz.questions) &&
    quiz.questions.every(isQuestion) &&
    new Set(quiz.questions.map((question) => (question as Record<string, unknown>).id)).size === quiz.questions.length &&
    (quiz.status === "draft" || quiz.status === "published") &&
    typeof quiz.createdAt === "string" &&
    typeof quiz.updatedAt === "string" &&
    typeof quiz.playCount === "number" &&
    Number.isFinite(quiz.playCount) &&
    (quiz.status === "draft" || (quiz.questions.length > 0 && quiz.questions.every((question) => {
      const item = question as Record<string, unknown>;
      return Boolean(item.text && String(item.text).trim()) &&
        Array.isArray(item.options) && item.options.every((option) => Boolean((option as Record<string, unknown>).text && String((option as Record<string, unknown>).text).trim())) &&
        typeof item.correctOptionId === "string" && item.options.some((option) => (option as Record<string, unknown>).id === item.correctOptionId);
    })))
  );
}

export function readQuizzes(): QuizSet[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      writeQuizzes(initialQuizzes);
      return initialQuizzes;
    }
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value) || !value.every(isQuiz) ||
      new Set(value.map((quiz) => quiz.id)).size !== value.length) {
      console.error("SOPHIA: local quiz data is invalid; existing data was preserved.");
      return [];
    }
    const hasPendingMigration =
      localStorage.getItem(DEMOCRACY_QUIZ_MIGRATION_KEY) !== "complete" ||
      localStorage.getItem(REQUESTED_DEMOCRACY_QUIZ_MIGRATION_KEY) !== "complete";
    if (hasPendingMigration) {
      const democracyQuiz = initialQuizzes.find((quiz) => quiz.id === DEMOCRACY_QUIZ_ID);
      const requestedQuiz = initialQuizzes.find((quiz) => quiz.id === REQUESTED_DEMOCRACY_QUIZ_ID);
      const migrated = [
        ...value,
        ...(localStorage.getItem(DEMOCRACY_QUIZ_MIGRATION_KEY) !== "complete" && democracyQuiz && !value.some((quiz) => quiz.id === DEMOCRACY_QUIZ_ID)
          ? [democracyQuiz]
          : []),
        ...(localStorage.getItem(REQUESTED_DEMOCRACY_QUIZ_MIGRATION_KEY) !== "complete" && requestedQuiz && !value.some((quiz) => quiz.id === REQUESTED_DEMOCRACY_QUIZ_ID)
          ? [requestedQuiz]
          : []),
      ];
      writeQuizzes(migrated);
      return migrated;
    }
    return value;
  } catch (error) {
    console.error("SOPHIA: could not parse local quiz data; existing data was preserved.", error);
    return [];
  }
}

export function writeQuizzes(quizzes: QuizSet[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
  localStorage.setItem(DEMOCRACY_QUIZ_MIGRATION_KEY, "complete");
  localStorage.setItem(REQUESTED_DEMOCRACY_QUIZ_MIGRATION_KEY, "complete");
}

export function readEditorDraft<T>(): T | null {
  try {
    const raw = localStorage.getItem(EDITOR_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error("SOPHIA: could not parse the saved editor draft.", error);
    return null;
  }
}

export function writeEditorDraft(value: unknown): void {
  localStorage.setItem(EDITOR_KEY, JSON.stringify(value));
}

export function clearEditorDraft(): void {
  localStorage.removeItem(EDITOR_KEY);
}

export function quizStorageKey(): string {
  return STORAGE_KEY;
}
