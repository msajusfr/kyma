import { useEffect, useMemo, useState } from "react";
import ExerciseSelector from "../components/ExerciseSelector";
import PhraseCard from "../components/PhraseCard";
import QuizOptions from "../components/QuizOptions";
import SeriesHeader from "../components/SeriesHeader";
import SeriesSelector from "../components/SeriesSelector";
import { exercises } from "../data/exercises";
import { useQuizEngine } from "../hooks/useQuizEngine";
import { getGreekVoiceName, speak } from "../services/speechService";
import type { GreekExercise } from "../types/GreekPhrase";

export default function QuizPage() {
  const [selectedExerciseId, setSelectedExerciseId] = useState(exercises[0].id);
  const selectedExercise =
    exercises.find((exercise) => exercise.id === selectedExerciseId) ?? exercises[0];

  return (
    <QuizSession
      key={selectedExercise.id}
      exercise={selectedExercise}
      selectedExerciseId={selectedExerciseId}
      onSelectExercise={setSelectedExerciseId}
    />
  );
}

interface QuizSessionProps {
  exercise: GreekExercise;
  selectedExerciseId: string;
  onSelectExercise: (exerciseId: string) => void;
}

function QuizSession({ exercise, selectedExerciseId, onSelectExercise }: QuizSessionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [greekVoiceName, setGreekVoiceName] = useState<string | null | undefined>(undefined);
  const storageKey =
    exercise.id === "level-test-1-10"
      ? "greek-quiz-trainer-progress"
      : `greek-quiz-trainer-progress-${exercise.id}`;
  const {
    current,
    currentSeries,
    feedback,
    isSeriesComplete,
    masteredCount,
    maxSeries,
    nextPhrase,
    progressBySeries,
    progressPercent,
    resetSeries,
    selectSeries,
    stats,
    submitAnswer,
    totalCount,
    unlockNextSeries,
  } = useQuizEngine(exercise.phrases, storageKey);
  const currentSeriesLabel = exercise.seriesLabels[currentSeries] ?? `Série ${currentSeries}`;

  useEffect(() => {
    getGreekVoiceName().then(setGreekVoiceName);
  }, []);

  const shuffledOptions = useMemo(
    () => (current ? shuffleOptions(current.options) : []),
    [current]
  );

  const handleAnswer = async (answer: string) => {
    if (!current || feedback || isAdvancing) return;

    setSelectedAnswer(answer);

    if (answer === current.translation) {
      setIsAdvancing(true);
      await speak(current.greek);
      submitAnswer(answer);
      setSelectedAnswer(null);
      setIsAdvancing(false);
      return;
    }

    submitAnswer(answer);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    nextPhrase();
  };

  return (
    <main className="min-h-screen px-4 py-5 text-[#f4efe2] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-6xl flex-col">
        <SeriesHeader
          exerciseTitle={exercise.title}
          masteredCount={masteredCount}
          progressPercent={progressPercent}
          series={currentSeries}
          seriesLabel={currentSeriesLabel}
          totalCount={totalCount}
        />
        <ExerciseSelector
          currentExerciseId={selectedExerciseId}
          exercises={exercises}
          onSelectExercise={(exerciseId) => {
            setSelectedAnswer(null);
            onSelectExercise(exerciseId);
          }}
        />
        <SeriesSelector
          currentSeries={currentSeries}
          progressBySeries={progressBySeries}
          seriesLabels={exercise.seriesLabels}
          onSelectSeries={(series) => {
            setSelectedAnswer(null);
            selectSeries(series);
          }}
        />

        {greekVoiceName === null ? (
          <section className="mb-4 rounded-xl border border-red-300/25 bg-red-500/10 p-4 text-sm leading-6 text-red-100">
            Aucune voix grecque n'est disponible dans ce navigateur. Installe une voix/langue grecque
            dans le système ou utilise un navigateur qui expose une voix <span className="font-bold">el-GR</span>.
          </section>
        ) : greekVoiceName ? (
          <section className="mb-4 rounded-xl border border-[#9fb27b]/25 bg-[#9fb27b]/10 p-3 text-xs text-[#f4efe2]/60">
            Voix grecque : {greekVoiceName}
          </section>
        ) : null}

        {current && !isSeriesComplete ? (
          <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="grid content-start gap-4">
              <PhraseCard phrase={current} />

              {feedback ? (
                <section
                  className="rounded-xl border border-red-400/35 bg-red-500/10 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.34)]"
                  aria-live="polite"
                >
                  <p className="text-2xl font-bold text-[#f4efe2]">Faux.</p>
                  <p className="mt-2 text-sm leading-6 text-[#f4efe2]/70">
                    La bonne réponse était :{" "}
                    <span className="font-semibold text-[#e7c982]">{feedback.answer}</span>
                  </p>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-[#e7c982]/30 bg-[#e7c982]/12 px-5 text-sm font-bold text-[#e7c982] transition hover:bg-[#e7c982]/20 focus:outline-none focus:ring-2 focus:ring-[#e7c982]/45 focus:ring-offset-2 focus:ring-offset-[#111716] active:scale-[0.99] sm:w-auto"
                  >
                    Phrase suivante
                  </button>
                </section>
              ) : null}
            </div>

            <aside className="flex min-h-[360px] flex-col rounded-xl border border-white/10 bg-[#18211f]/90 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)]">
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e7c982]/70">
                  Traduction
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#f4efe2]">
                  Quelle est la bonne traduction ?
                </h2>
              </div>
              <QuizOptions
                correctAnswer={current.translation}
                disabled={feedback !== null || isAdvancing}
                onAnswer={handleAnswer}
                options={shuffledOptions}
                selectedAnswer={selectedAnswer}
              />
              <div className="mt-auto pt-5">
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-lg border border-white/8 bg-white/[0.04] p-3">
                    <p className="text-lg font-bold text-[#f4efe2]">{stats.correct}</p>
                    <p className="mt-1 text-[#f4efe2]/45">justes</p>
                  </div>
                  <div className="rounded-lg border border-white/8 bg-white/[0.04] p-3">
                    <p className="text-lg font-bold text-[#f4efe2]">{stats.incorrect}</p>
                    <p className="mt-1 text-[#f4efe2]/45">ratées</p>
                  </div>
                  <div className="rounded-lg border border-white/8 bg-white/[0.04] p-3">
                    <p className="text-lg font-bold text-[#f4efe2]">{totalCount - masteredCount}</p>
                    <p className="mt-1 text-[#f4efe2]/45">à voir</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <section className="rounded-xl border border-white/10 bg-[#18211f]/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.34)] md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#e7c982]/75">
              Progression
            </p>
            <h2 className="mt-3 text-4xl font-bold text-[#f4efe2]">
              Série {currentSeries} terminée
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#f4efe2]/65">
              {currentSeries < maxSeries
                ? `Série ${currentSeries + 1} débloquée. Tu as maîtrisé les ${totalCount} phrases de cette série.`
                : `Exercice terminé. Tu as maîtrisé les ${totalCount} phrases de cette série.`}
            </p>
            <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              <p className="rounded-lg border border-[#9fb27b]/25 bg-[#9fb27b]/12 p-4 font-semibold text-[#f4efe2]">
                Réponses correctes : {stats.correct}
              </p>
              <p className="rounded-lg border border-red-400/25 bg-red-500/10 p-4 font-semibold text-[#f4efe2]">
                Réponses incorrectes : {stats.incorrect}
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {currentSeries < maxSeries ? (
                <button
                  type="button"
                  onClick={unlockNextSeries}
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#e7c982]/30 bg-[#e7c982]/12 px-5 text-sm font-bold text-[#e7c982] transition hover:bg-[#e7c982]/20 focus:outline-none focus:ring-2 focus:ring-[#e7c982]/45 focus:ring-offset-2 focus:ring-offset-[#18211f]"
                >
                  Passer à la série {currentSeries + 1}
                </button>
              ) : null}
              <button
                type="button"
                onClick={resetSeries}
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/10 bg-white/[0.045] px-5 text-sm font-bold text-[#f4efe2] transition hover:bg-white/[0.075] focus:outline-none focus:ring-2 focus:ring-[#e7c982]/45 focus:ring-offset-2 focus:ring-offset-[#18211f]"
              >
                Recommencer la série
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function shuffleOptions(options: string[]) {
  const shuffled = [...options];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}
