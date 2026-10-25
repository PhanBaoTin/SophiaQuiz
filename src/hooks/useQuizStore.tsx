import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { QuizSet } from "../types/quiz";
import { readQuizzes, writeQuizzes } from "../services/quizStorage";
import { deleteSoundAsset } from "../services/soundAssets";
import { deleteImageAsset } from "../services/imageAssets";

interface QuizStoreValue {
  quizzes: QuizSet[];
  error: string | null;
  clearError: () => void;
  saveQuiz: (quiz: QuizSet) => boolean;
  deleteQuiz: (id: string) => boolean;
  incrementPlayCount: (id: string) => void;
}

const QuizStoreContext = createContext<QuizStoreValue | null>(null);

export function QuizStoreProvider({ children }: { children: ReactNode }) {
  const [quizzes, setQuizzes] = useState<QuizSet[]>(() => {
    try {
      return readQuizzes();
    } catch (error) {
      console.error("SOPHIA: local storage could not be read.", error);
      return [];
    }
  });
  const [error, setError] = useState<string | null>(null);

  const update = useCallback((next: QuizSet[]): boolean => {
    try {
      writeQuizzes(next);
      setQuizzes(next);
      setError(null);
      return true;
    } catch (cause) {
      console.error("SOPHIA: local storage could not be updated.", cause);
      setError("Không thể lưu dữ liệu trên thiết bị. Hãy kiểm tra dung lượng hoặc quyền lưu trữ của trình duyệt.");
      return false;
    }
  }, []);

  const saveQuiz = useCallback((quiz: QuizSet): boolean => {
    return update([quiz, ...quizzes.filter((item) => item.id !== quiz.id)]);
  }, [quizzes, update]);

  const deleteQuiz = useCallback((id: string): boolean => {
    const removed = quizzes.find((quiz) => quiz.id === id);
    const deleted = update(quizzes.filter((quiz) => quiz.id !== id));
    if (deleted && removed) {
      for (const assetId of Object.values(removed.sounds ?? {})) {
        if (assetId) void deleteSoundAsset(assetId).catch((error: unknown) => console.error("SOPHIA: could not remove audio files for a deleted quiz.", error));
      }
      if (removed.avatarImageId) {
        void deleteImageAsset(removed.avatarImageId).catch((error: unknown) => console.error("SOPHIA: could not remove the image for a deleted quiz.", error));
      }
    }
    return deleted;
  }, [quizzes, update]);

  const incrementPlayCount = useCallback((id: string) => {
    const current = quizzes.find((quiz) => quiz.id === id);
    if (!current) return;
    update(quizzes.map((quiz) => quiz.id === id ? { ...quiz, playCount: quiz.playCount + 1, updatedAt: new Date().toISOString() } : quiz));
  }, [quizzes, update]);

  const value = useMemo(() => ({ quizzes, error, clearError: () => setError(null), saveQuiz, deleteQuiz, incrementPlayCount }), [quizzes, error, saveQuiz, deleteQuiz, incrementPlayCount]);
  return <QuizStoreContext.Provider value={value}>{children}</QuizStoreContext.Provider>;
}

export function useQuizStore(): QuizStoreValue {
  const value = useContext(QuizStoreContext);
  if (!value) throw new Error("useQuizStore must be used within QuizStoreProvider");
  return value;
}
