import { useMemo, useState } from "react";
import AudioButton from "../components/AudioButton";
import ExerciseSelector from "../components/ExerciseSelector";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type {
  AssistedReadingChapter,
  AssistedReadingExercise,
  AssistedReadingSentence,
  GreekExercise,
} from "../types/GreekPhrase";

const SENTENCES_PER_PAGE = 4;

interface ReadingProgress {
  currentChapterId: string;
  readSentenceIds: string[];
}

interface AssistedReadingPageProps {
  exercise: AssistedReadingExercise;
  exercises: GreekExercise[];
  selectedExerciseId: string;
  onSelectExercise: (exerciseId: string) => void;
}

export default function AssistedReadingPage({
  exercise,
  exercises,
  selectedExerciseId,
  onSelectExercise,
}: AssistedReadingPageProps) {
  const firstChapter = exercise.chapters[0];
  const [progress, setProgress] = useLocalStorage<ReadingProgress>(
    `kyma-assisted-reading-progress-${exercise.id}`,
    {
      currentChapterId: firstChapter.id,
      readSentenceIds: [],
    }
  );
  const [pageIndexByChapter, setPageIndexByChapter] = useState<Record<string, number>>({});
  const [selectedSentenceId, setSelectedSentenceId] = useState<string | null>(null);

  const currentChapter =
    exercise.chapters.find((chapter) => chapter.id === progress.currentChapterId) ?? firstChapter;
  const readSentenceIds = useMemo(
    () => new Set(progress.readSentenceIds),
    [progress.readSentenceIds]
  );
  const currentPageIndex = pageIndexByChapter[currentChapter.id] ?? 0;
  const pageCount = Math.max(1, Math.ceil(currentChapter.sentences.length / SENTENCES_PER_PAGE));
  const pageSentences = currentChapter.sentences.slice(
    currentPageIndex * SENTENCES_PER_PAGE,
    currentPageIndex * SENTENCES_PER_PAGE + SENTENCES_PER_PAGE
  );
  const selectedSentence =
    currentChapter.sentences.find((sentence) => sentence.id === selectedSentenceId) ??
    pageSentences[0] ??
    currentChapter.sentences[0];
  const totalSentences = exercise.chapters.reduce(
    (total, chapter) => total + chapter.sentences.length,
    0
  );
  const totalRead = exercise.chapters.reduce(
    (total, chapter) =>
      total + chapter.sentences.filter((sentence) => readSentenceIds.has(sentence.id)).length,
    0
  );
  const overallProgress = totalSentences > 0 ? Math.round((totalRead / totalSentences) * 100) : 0;

  const selectChapter = (chapter: AssistedReadingChapter) => {
    setSelectedSentenceId(chapter.sentences[0]?.id ?? null);
    setProgress((previous) => ({
      ...previous,
      currentChapterId: chapter.id,
    }));
  };

  const selectSentence = (sentence: AssistedReadingSentence) => {
    setSelectedSentenceId(sentence.id);
    setProgress((previous) => ({
      ...previous,
      readSentenceIds: Array.from(new Set([...previous.readSentenceIds, sentence.id])),
    }));
  };

  const setPageIndex = (nextPageIndex: number) => {
    const safePageIndex = Math.min(Math.max(nextPageIndex, 0), pageCount - 1);
    setSelectedSentenceId(null);
    setPageIndexByChapter((previous) => ({
      ...previous,
      [currentChapter.id]: safePageIndex,
    }));
  };

  return (
    <main className="min-h-screen px-4 py-5 text-[#f4efe2] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-6xl flex-col">
        <section className="mb-4 rounded-xl border border-white/10 bg-[#18211f]/90 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e7c982]/75">
            {exercise.title}
          </p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#f4efe2] md:text-5xl">
                {exercise.bookTitle}
              </h1>
              <p className="mt-2 text-sm text-[#f4efe2]/60">{exercise.author}</p>
            </div>
            <div className="min-w-52">
              <div className="flex items-center justify-between text-xs font-semibold text-[#f4efe2]/55">
                <span>Progression</span>
                <span>{overallProgress}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#2ea6a0] to-[#e7c982]"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        <ExerciseSelector
          currentExerciseId={selectedExerciseId}
          exercises={exercises}
          onSelectExercise={onSelectExercise}
        />

        <section className="mb-4 rounded-xl border border-white/10 bg-[#18211f]/80 p-3 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {exercise.chapters.map((chapter) => {
              const active = chapter.id === currentChapter.id;
              const masteredCount = chapter.sentences.filter((sentence) =>
                readSentenceIds.has(sentence.id)
              ).length;
              const percent =
                chapter.sentences.length > 0
                  ? Math.round((masteredCount / chapter.sentences.length) * 100)
                  : 0;

              return (
                <button
                  key={chapter.id}
                  type="button"
                  onClick={() => selectChapter(chapter)}
                  className={`min-w-36 rounded-lg border px-3 py-2 text-left transition active:scale-[0.99] ${
                    active
                      ? "border-[#e7c982]/45 bg-[#e7c982]/12 text-[#f4efe2]"
                      : "border-white/8 bg-white/[0.04] text-[#f4efe2]/70 hover:border-[#e7c982]/25 hover:bg-white/[0.07]"
                  }`}
                >
                  <span className="block text-xs font-bold uppercase tracking-[0.16em] text-[#e7c982]/75">
                    Chapitre {chapter.label}
                  </span>
                  <span className="mt-1 block text-sm font-semibold">{chapter.title}</span>
                  <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-white/10">
                    <span
                      className="block h-full rounded-full bg-gradient-to-r from-[#2ea6a0] to-[#e7c982]"
                      style={{ width: `${percent}%` }}
                    />
                  </span>
                  <span className="mt-1 block text-xs text-[#f4efe2]/45">
                    {masteredCount} / {chapter.sentences.length}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="min-h-0 flex-1">
          <section className="flex min-h-0 flex-col rounded-xl border border-[#d8d6cd] bg-[#f5f5f2] p-4 text-[#343434] shadow-[0_24px_80px_rgba(0,0,0,0.22)] sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#d8d6cd] pb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#77736a]">
                  {currentChapter.title}
                </p>
                <h2 className="mt-1 text-xl font-bold text-[#2d2d2d]">{exercise.bookTitle}</h2>
              </div>
              <AudioButton text={selectedSentence?.greek ?? pageSentences[0]?.greek ?? ""} />
            </div>

            <article className="h-[48vh] min-h-80 flex-none overflow-y-auto rounded-lg bg-[#fbfaf7] px-4 py-5 shadow-inner sm:px-8 sm:py-7 md:min-h-[34rem] md:flex-1">
              <div className="mx-auto max-w-3xl text-lg leading-9 sm:text-xl sm:leading-10">
                {pageSentences.map((sentence) => {
                  const selected = sentence.id === selectedSentence?.id;
                  const read = readSentenceIds.has(sentence.id);

                  return (
                    <button
                      key={sentence.id}
                      type="button"
                      onMouseEnter={() => setSelectedSentenceId(sentence.id)}
                      onFocus={() => setSelectedSentenceId(sentence.id)}
                      onClick={() => selectSentence(sentence)}
                      className={`mr-1 rounded-md px-1.5 py-0.5 text-left align-baseline transition ${
                        selected
                          ? "bg-[#e7c982]/55 text-[#1f1e1a] shadow-[0_0_0_1px_rgba(150,118,44,0.25)]"
                          : read
                            ? "bg-[#2ea6a0]/10 text-[#2f3a38] hover:bg-[#e7c982]/30"
                            : "hover:bg-[#e7c982]/28"
                      }`}
                    >
                      {sentence.greek}
                    </button>
                  );
                })}
              </div>
            </article>

            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setPageIndex(currentPageIndex - 1)}
                disabled={currentPageIndex === 0}
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#c7c3b7] bg-white px-4 text-sm font-bold text-[#343434] transition hover:bg-[#f0ede6] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Precedent
              </button>
              <p className="text-sm font-semibold text-[#77736a]">
                Page {currentPageIndex + 1} / {pageCount}
              </p>
              <button
                type="button"
                onClick={() => setPageIndex(currentPageIndex + 1)}
                disabled={currentPageIndex >= pageCount - 1}
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#c7c3b7] bg-white px-4 text-sm font-bold text-[#343434] transition hover:bg-[#f0ede6] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Suivant
              </button>
            </div>

            <section className="sticky bottom-3 z-10 mt-4 rounded-lg border border-[#d8d6cd] bg-white p-4 text-[#343434] shadow-[0_12px_35px_rgba(0,0,0,0.14)] md:static">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#77736a]">
                Traduction
              </p>
              <p className="mt-2 text-base leading-7 text-[#343434]">
                {selectedSentence?.translation ?? "Touchez une phrase pour afficher sa traduction."}
              </p>
            </section>
          </section>
        </div>
      </div>
    </main>
  );
}
