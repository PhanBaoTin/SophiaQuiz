export type QuizStatus = "draft" | "published";
export type ThinkingTime = number;
export type QuizSoundType = "countdown" | "correct" | "wrong";

export type QuizSounds = Partial<Record<QuizSoundType, string>>;

export interface AnswerOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  options: [AnswerOption, AnswerOption, AnswerOption, AnswerOption];
  correctOptionId: string;
  explanation?: string;
}

export interface QuizSet {
  id: string;
  title: string;
  description: string;
  category: string;
  thinkingTime: ThinkingTime;
  avatarImageId?: string;
  sounds?: QuizSounds;
  questions: Question[];
  status: QuizStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  playCount: number;
}

export interface QuizInput {
  title: string;
  description: string;
  category: string;
  thinkingTime: ThinkingTime;
  avatarImageId?: string;
  sounds?: QuizSounds;
  questions: Question[];
}
