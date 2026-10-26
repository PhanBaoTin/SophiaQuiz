import { beforeEach, describe, expect, it, vi } from "vitest";
import { quizStorageKey, readQuizzes, writeQuizzes } from "./quizStorage";
import { initialQuizzes } from "../data/initialQuizzes";
import type { QuizSet } from "../types/quiz";

const quiz: QuizSet = {
  id: "quiz-1",
  title: "Kiến thức",
  description: "",
  category: "",
  thinkingTime: 15,
  questions: [{
    id: "question-1",
    text: "1 + 1?",
    options: [
      { id: "a", text: "2" },
      { id: "b", text: "3" },
      { id: "c", text: "4" },
      { id: "d", text: "5" },
    ],
    correctOptionId: "a",
  }],
  status: "draft",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  playCount: 0,
};

beforeEach(() => localStorage.clear());

describe("local quiz storage", () => {
  it("initializes a fresh browser with the requested published quiz", () => {
    expect(readQuizzes()).toEqual(initialQuizzes);
    expect(JSON.parse(localStorage.getItem(quizStorageKey()) ?? "[]")).toEqual(initialQuizzes);
  });

  it("does not recreate a quiz after the user deletes all quizzes", () => {
    writeQuizzes([]);
    expect(readQuizzes()).toEqual([]);
  });

  it("adds the new default quiz to existing browser data once", () => {
    localStorage.setItem(quizStorageKey(), JSON.stringify([quiz]));

    const migrated = readQuizzes();
    expect(migrated).toEqual([quiz, initialQuizzes[1], initialQuizzes[2]]);

    writeQuizzes([quiz]);
    expect(readQuizzes()).toEqual([quiz]);
  });

  it("adds the requested quiz to browsers that already completed the earlier migration", () => {
    localStorage.setItem(quizStorageKey(), JSON.stringify([quiz, initialQuizzes[1]]));
    localStorage.setItem("sophia.quizSets.migration.democracy-quiz", "complete");

    expect(readQuizzes()).toEqual([quiz, initialQuizzes[1], initialQuizzes[2]]);
    writeQuizzes([quiz]);
    expect(readQuizzes()).toEqual([quiz]);
  });

  it("includes the seven requested questions with their correct answers", () => {
    const democracyQuiz = initialQuizzes[1];
    expect(democracyQuiz.questions).toHaveLength(7);
    expect(democracyQuiz.questions.map((question) =>
      question.options.findIndex((option) => option.id === question.correctOptionId),
    )).toEqual([0, 3, 2, 1, 2, 3, 0]);
  });

  it("includes the requested seven-question quiz with a 10-second timer and correct answers", () => {
    const requestedQuiz = initialQuizzes[2];
    expect(requestedQuiz.thinkingTime).toBe(10);
    expect(requestedQuiz.questions).toHaveLength(7);
    expect(requestedQuiz.questions.map((question) =>
      question.options.findIndex((option) => option.id === question.correctOptionId),
    )).toEqual([2, 3, 0, 0, 1, 1, 2]);
  });

  it("persists quiz data between reads", () => {
    writeQuizzes([quiz]);
    expect(readQuizzes()).toEqual([quiz]);
  });

  it("persists uploaded audio references with a quiz", () => {
    const withSounds = { ...quiz, sounds: { countdown: "countdown-asset", correct: "correct-asset", wrong: "wrong-asset" } };
    writeQuizzes([withSounds]);
    expect(readQuizzes()).toEqual([withSounds]);
  });

  it("persists an optional avatar image reference with a quiz", () => {
    const withAvatar = { ...quiz, avatarImageId: "avatar-image" };
    writeQuizzes([withAvatar]);
    expect(readQuizzes()).toEqual([withAvatar]);
  });

  it("rejects malformed uploaded audio references", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    localStorage.setItem(quizStorageKey(), JSON.stringify([{ ...quiz, sounds: { countdown: "" } }]));
    expect(readQuizzes()).toEqual([]);
    expect(error).toHaveBeenCalledOnce();
    error.mockRestore();
  });

  it("keeps incomplete saved drafts available after reload", () => {
    const draft: QuizSet = {
      ...quiz,
      status: "draft",
      questions: [{
        id: "question-draft",
        text: "",
        options: [
          { id: "draft-a", text: "" },
          { id: "draft-b", text: "" },
          { id: "draft-c", text: "" },
          { id: "draft-d", text: "" },
        ],
        correctOptionId: "",
      }],
    };
    writeQuizzes([draft]);
    expect(readQuizzes()).toEqual([draft]);
  });

  it("preserves malformed data and returns an empty collection", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    localStorage.setItem(quizStorageKey(), "{invalid");
    expect(readQuizzes()).toEqual([]);
    expect(localStorage.getItem(quizStorageKey())).toBe("{invalid");
    expect(error).toHaveBeenCalledOnce();
    error.mockRestore();
  });
});
