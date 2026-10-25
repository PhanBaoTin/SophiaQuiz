import { describe, expect, it } from "vitest";
import { validateQuestion, validateQuiz } from "./quizValidation";
import type { Question, QuizInput } from "../types/quiz";

const question: Question = {
  id: "question-1",
  text: "Thủ đô của Việt Nam là gì?",
  options: [
    { id: "a", text: "Hà Nội" },
    { id: "b", text: "Huế" },
    { id: "c", text: "Đà Nẵng" },
    { id: "d", text: "Cần Thơ" },
  ],
  correctOptionId: "a",
};

const input: QuizInput = { title: "Địa lý", description: "", category: "", thinkingTime: 15, questions: [question] };

describe("quiz validation", () => {
  it("accepts a complete question and publishable quiz", () => {
    expect(validateQuestion(question)).toBeNull();
    expect(validateQuiz(input)).toEqual({});
  });

  it("rejects a missing correct answer and invalid publish data", () => {
    expect(validateQuestion({ ...question, options: question.options.map((option) => ({ ...option, text: "" })) as Question["options"] })).toContain("bốn đáp án");
    expect(validateQuiz({ ...input, title: " ", thinkingTime: 4, questions: [] })).toMatchObject({
      title: expect.any(String),
      thinkingTime: expect.any(String),
      questions: expect.any(String),
    });
  });
});
