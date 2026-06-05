import { useState, useMemo, useCallback } from "react";
import { GreekPhrase } from "../types/GreekPhrase";

interface QuizState {
  queue: GreekPhrase[];
  current: GreekPhrase | null;
  streak: number;
  correctIds: string[];
  incorrectIds: string[];
}

export function useQuizEngine(phrases: GreekPhrase[]) {
  const [state, setState] = useState<QuizState>(() => {
    const shuffled = [...phrases].sort(() => Math.random() - 0.5);
    return {
      queue: shuffled,
      current: shuffled[0] ?? null,
      streak: 0,
      correctIds: [],
      incorrectIds: [],
    };
  });

  const answer = useCallback((phraseId: string, correct: boolean) => {
    setState((prev) => {
      if (!prev.current) return prev;

      const newCorrect = correct
        ? [...prev.correctIds, phraseId]
        : prev.correctIds;
      const newIncorrect = !correct
        ? [...prev.incorrectIds, phraseId]
        : prev.incorrectIds;

      let nextQueue = prev.queue.slice(1);

      if (!correct) {
        // Re-insert later in the queue
        const failed = prev.current;
        const insertAt = Math.min(nextQueue.length, 3);
        nextQueue.splice(insertAt, 0, failed);
      }

      const next = nextQueue[0] ?? null;

      return {
        queue: nextQueue,
        current: next,
        streak: correct ? prev.streak + 1 : 0,
        correctIds: newCorrect,
        incorrectIds: newIncorrect,
      };
    });
  }, []);

  const reset = useCallback(() => {
    const shuffled = [...phrases].sort(() => Math.random() - 0.5);
    setState({
      queue: shuffled,
      current: shuffled[0] ?? null,
      streak: 0,
      correctIds: [],
      incorrectIds: [],
    });
  }, [phrases]);

  const progress = useMemo(() => {
    const total = phrases.length;
    const answered = new Set([...state.correctIds, ...state.incorrectIds]).size;
    return total > 0 ? Math.round((answered / total) * 100) : 0;
  }, [phrases.length, state.correctIds, state.incorrectIds]);

  return {
    current: state.current,
    streak: state.streak,
    progress,
    answer,
    reset,
    remaining: state.queue.length,
  };
}
