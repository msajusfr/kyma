import { useCallback, useEffect, useMemo, useState } from "react";
import type { GreekPhrase } from "../types/GreekPhrase";
import { useLocalStorage } from "./useLocalStorage";

type QuizFeedback =
  | { kind: "correct"; answer: string; phraseId: string }
  | { kind: "incorrect"; answer: string; phraseId: string };

interface QuizProgress {
  currentSeries: number;
  masteredIds: string[];
  queueIds: string[];
  stats: {
    attempts: number;
    correct: number;
    incorrect: number;
    missedById: Record<string, number>;
  };
}

const STORAGE_KEY = "greek-quiz-trainer-progress";

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function createInitialProgress(phrases: GreekPhrase[]): QuizProgress {
  return {
    currentSeries: 1,
    masteredIds: [],
    queueIds: shuffle(phrases.filter((phrase) => phrase.series === 1).map((phrase) => phrase.id)),
    stats: {
      attempts: 0,
      correct: 0,
      incorrect: 0,
      missedById: {},
    },
  };
}

export function useQuizEngine(phrases: GreekPhrase[]) {
  const [progress, setProgress] = useLocalStorage<QuizProgress>(
    STORAGE_KEY,
    createInitialProgress(phrases)
  );
  const [feedback, setFeedback] = useState<QuizFeedback | null>(null);

  const seriesPhrases = useMemo(
    () => phrases.filter((phrase) => phrase.series === progress.currentSeries),
    [phrases, progress.currentSeries]
  );

  const phraseById = useMemo(
    () => new Map(phrases.map((phrase) => [phrase.id, phrase])),
    [phrases]
  );

  useEffect(() => {
    setProgress((previous) => {
      const validIds = new Set(seriesPhrases.map((phrase) => phrase.id));
      const masteredIds = previous.masteredIds.filter((id) => validIds.has(id));
      const missingIds = seriesPhrases
        .map((phrase) => phrase.id)
        .filter((id) => !masteredIds.includes(id) && !previous.queueIds.includes(id));
      const queueIds = [...previous.queueIds.filter((id) => validIds.has(id)), ...shuffle(missingIds)];

      if (
        masteredIds.length === previous.masteredIds.length &&
        queueIds.length === previous.queueIds.length
      ) {
        return previous;
      }

      return { ...previous, masteredIds, queueIds };
    });
  }, [seriesPhrases, setProgress]);

  const activePhraseId = feedback?.phraseId ?? progress.queueIds[0];
  const current = activePhraseId ? phraseById.get(activePhraseId) ?? null : null;
  const masteredCount = progress.masteredIds.length;
  const totalCount = seriesPhrases.length;
  const isSeriesComplete = totalCount > 0 && masteredCount >= totalCount;

  const submitAnswer = useCallback(
    (selectedAnswer: string) => {
      if (!current || feedback) return;

      const isCorrect = selectedAnswer === current.translation;
      if (!isCorrect) {
        setFeedback({
          kind: "incorrect",
          answer: current.translation,
          phraseId: current.id,
        });
      }

      setProgress((previous) => {
        const queueRest = previous.queueIds.slice(1);
        const missedCount = previous.stats.missedById[current.id] ?? 0;
        const masteredIds = isCorrect
          ? Array.from(new Set([...previous.masteredIds, current.id]))
          : previous.masteredIds;
        const missedById = {
          ...previous.stats.missedById,
          [current.id]: isCorrect ? missedCount : missedCount + 1,
        };

        let queueIds = queueRest;
        if (!isCorrect) {
          const delay = Math.min(queueRest.length, 3 + Math.min(missedCount, 4));
          queueIds = [...queueRest.slice(0, delay), current.id, ...queueRest.slice(delay)];
        }

        return {
          ...previous,
          masteredIds,
          queueIds,
          stats: {
            attempts: previous.stats.attempts + 1,
            correct: previous.stats.correct + (isCorrect ? 1 : 0),
            incorrect: previous.stats.incorrect + (isCorrect ? 0 : 1),
            missedById,
          },
        };
      });
    },
    [current, feedback, setProgress]
  );

  const nextPhrase = useCallback(() => {
    setFeedback(null);
  }, []);

  const resetSeries = useCallback(() => {
    setFeedback(null);
    setProgress((previous) => ({
      ...previous,
      masteredIds: [],
      queueIds: shuffle(seriesPhrases.map((phrase) => phrase.id)),
      stats: {
        attempts: 0,
        correct: 0,
        incorrect: 0,
        missedById: {},
      },
    }));
  }, [seriesPhrases, setProgress]);

  const unlockNextSeries = useCallback(() => {
    setFeedback(null);
    setProgress((previous) => ({
      ...previous,
      currentSeries: previous.currentSeries + 1,
      masteredIds: [],
      queueIds: shuffle(
        phrases
          .filter((phrase) => phrase.series === previous.currentSeries + 1)
          .map((phrase) => phrase.id)
      ),
    }));
  }, [phrases, setProgress]);

  return {
    current,
    currentSeries: progress.currentSeries,
    feedback,
    isSeriesComplete,
    masteredCount,
    nextPhrase,
    progressPercent: totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0,
    resetSeries,
    stats: progress.stats,
    submitAnswer,
    totalCount,
    unlockNextSeries,
  };
}
