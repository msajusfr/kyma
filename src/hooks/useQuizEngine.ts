import { useCallback, useEffect, useMemo, useState } from "react";
import type { GreekPhrase } from "../types/GreekPhrase";
import { useLocalStorage } from "./useLocalStorage";

type QuizFeedback = { kind: "incorrect"; answer: string; phraseId: string };

interface SeriesProgress {
  masteredIds: string[];
  queueIds: string[];
  stats: {
    attempts: number;
    correct: number;
    incorrect: number;
    missedById: Record<string, number>;
  };
}

interface QuizProgress {
  currentSeries: number;
  series: Record<string, SeriesProgress>;
}

const STORAGE_KEY = "greek-quiz-trainer-progress";

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function createSeriesProgress(phrases: GreekPhrase[], series: number): SeriesProgress {
  return {
    masteredIds: [],
    queueIds: shuffle(phrases.filter((phrase) => phrase.series === series).map((phrase) => phrase.id)),
    stats: {
      attempts: 0,
      correct: 0,
      incorrect: 0,
      missedById: {},
    },
  };
}

function createInitialProgress(phrases: GreekPhrase[]): QuizProgress {
  return {
    currentSeries: 1,
    series: {
      "1": createSeriesProgress(phrases, 1),
    },
  };
}

function migrateProgress(rawProgress: unknown, phrases: GreekPhrase[]): QuizProgress {
  if (
    rawProgress &&
    typeof rawProgress === "object" &&
    "series" in rawProgress &&
    "currentSeries" in rawProgress
  ) {
    return rawProgress as QuizProgress;
  }

  if (
    rawProgress &&
    typeof rawProgress === "object" &&
    "currentSeries" in rawProgress &&
    "masteredIds" in rawProgress &&
    "queueIds" in rawProgress &&
    "stats" in rawProgress
  ) {
    const previous = rawProgress as {
      currentSeries: number;
      masteredIds: string[];
      queueIds: string[];
      stats: SeriesProgress["stats"];
    };

    return {
      currentSeries: previous.currentSeries,
      series: {
        [String(previous.currentSeries)]: {
          masteredIds: previous.masteredIds,
          queueIds: previous.queueIds,
          stats: previous.stats,
        },
      },
    };
  }

  return createInitialProgress(phrases);
}

export function useQuizEngine(phrases: GreekPhrase[]) {
  const initialProgress = useMemo(() => createInitialProgress(phrases), [phrases]);
  const [storedProgress, setProgress] = useLocalStorage<unknown>(STORAGE_KEY, initialProgress);
  const progress = useMemo(
    () => migrateProgress(storedProgress, phrases),
    [storedProgress, phrases]
  );
  const [feedback, setFeedback] = useState<QuizFeedback | null>(null);

  const availableSeries = useMemo(
    () => Array.from(new Set(phrases.map((phrase) => phrase.series))).sort((a, b) => a - b),
    [phrases]
  );

  const currentSeriesProgress =
    progress.series[String(progress.currentSeries)] ??
    createSeriesProgress(phrases, progress.currentSeries);

  const seriesPhrases = useMemo(
    () => phrases.filter((phrase) => phrase.series === progress.currentSeries),
    [phrases, progress.currentSeries]
  );

  const phraseById = useMemo(
    () => new Map(phrases.map((phrase) => [phrase.id, phrase])),
    [phrases]
  );

  useEffect(() => {
    setProgress((previousRaw: unknown) => {
      const previous = migrateProgress(previousRaw, phrases);
      const seriesKey = String(previous.currentSeries);
      const existing = previous.series[seriesKey] ?? createSeriesProgress(phrases, previous.currentSeries);
      const validIds = new Set(seriesPhrases.map((phrase) => phrase.id));
      const masteredIds = existing.masteredIds.filter((id) => validIds.has(id));
      const missingIds = seriesPhrases
        .map((phrase) => phrase.id)
        .filter((id) => !masteredIds.includes(id) && !existing.queueIds.includes(id));
      const queueIds = [...existing.queueIds.filter((id) => validIds.has(id)), ...shuffle(missingIds)];

      if (
        masteredIds.length === existing.masteredIds.length &&
        queueIds.length === existing.queueIds.length &&
        previous.series[seriesKey]
      ) {
        return previous;
      }

      return {
        ...previous,
        series: {
          ...previous.series,
          [seriesKey]: {
            ...existing,
            masteredIds,
            queueIds,
          },
        },
      };
    });
  }, [phrases, seriesPhrases, setProgress]);

  const activePhraseId = feedback?.phraseId ?? currentSeriesProgress.queueIds[0];
  const current = activePhraseId ? phraseById.get(activePhraseId) ?? null : null;
  const masteredCount = currentSeriesProgress.masteredIds.length;
  const totalCount = seriesPhrases.length;
  const isSeriesComplete = totalCount > 0 && masteredCount >= totalCount;

  const selectSeries = useCallback(
    (series: number) => {
      setFeedback(null);
      setProgress((previousRaw: unknown) => {
        const previous = migrateProgress(previousRaw, phrases);
        return {
          ...previous,
          currentSeries: series,
          series: {
            ...previous.series,
            [String(series)]: previous.series[String(series)] ?? createSeriesProgress(phrases, series),
          },
        };
      });
    },
    [phrases, setProgress]
  );

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

      setProgress((previousRaw: unknown) => {
        const previous = migrateProgress(previousRaw, phrases);
        const seriesKey = String(previous.currentSeries);
        const existing = previous.series[seriesKey] ?? createSeriesProgress(phrases, previous.currentSeries);
        const queueRest = existing.queueIds.slice(1);
        const missedCount = existing.stats.missedById[current.id] ?? 0;
        const masteredIds = isCorrect
          ? Array.from(new Set([...existing.masteredIds, current.id]))
          : existing.masteredIds;
        const missedById = {
          ...existing.stats.missedById,
          [current.id]: isCorrect ? missedCount : missedCount + 1,
        };

        let queueIds = queueRest;
        if (!isCorrect) {
          const delay = Math.min(queueRest.length, 3 + Math.min(missedCount, 4));
          queueIds = [...queueRest.slice(0, delay), current.id, ...queueRest.slice(delay)];
        }

        return {
          ...previous,
          series: {
            ...previous.series,
            [seriesKey]: {
              masteredIds,
              queueIds,
              stats: {
                attempts: existing.stats.attempts + 1,
                correct: existing.stats.correct + (isCorrect ? 1 : 0),
                incorrect: existing.stats.incorrect + (isCorrect ? 0 : 1),
                missedById,
              },
            },
          },
        };
      });
    },
    [current, feedback, phrases, setProgress]
  );

  const nextPhrase = useCallback(() => {
    setFeedback(null);
  }, []);

  const resetSeries = useCallback(() => {
    setFeedback(null);
    setProgress((previousRaw: unknown) => {
      const previous = migrateProgress(previousRaw, phrases);
      return {
        ...previous,
        series: {
          ...previous.series,
          [String(previous.currentSeries)]: createSeriesProgress(phrases, previous.currentSeries),
        },
      };
    });
  }, [phrases, setProgress]);

  const unlockNextSeries = useCallback(() => {
    const nextSeries = Math.min(progress.currentSeries + 1, Math.max(...availableSeries));
    selectSeries(nextSeries);
  }, [availableSeries, progress.currentSeries, selectSeries]);

  return {
    availableSeries,
    current,
    currentSeries: progress.currentSeries,
    feedback,
    isSeriesComplete,
    masteredCount,
    nextPhrase,
    progressBySeries: availableSeries.map((series) => {
      const seriesProgress = progress.series[String(series)] ?? createSeriesProgress(phrases, series);
      const total = phrases.filter((phrase) => phrase.series === series).length;
      return {
        series,
        masteredCount: seriesProgress.masteredIds.length,
        totalCount: total,
      };
    }),
    progressPercent: totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0,
    resetSeries,
    selectSeries,
    stats: currentSeriesProgress.stats,
    submitAnswer,
    totalCount,
    unlockNextSeries,
  };
}
