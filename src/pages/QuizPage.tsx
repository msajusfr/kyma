import { useEffect, useState } from "react";
import PhraseCard from "../components/PhraseCard";
import QuizOptions from "../components/QuizOptions";
import SeriesHeader from "../components/SeriesHeader";
import SeriesSelector from "../components/SeriesSelector";
import { phrases } from "../data/phrases";
import { useQuizEngine } from "../hooks/useQuizEngine";
import { getGreekVoiceName, speak } from "../services/speechService";

export default function QuizPage() {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [greekVoiceName, setGreekVoiceName] = useState<string | null | undefined>(undefined);
  const {
    current,
    currentSeries,
    feedback,
    isSeriesComplete,
    masteredCount,
    nextPhrase,
    progressBySeries,
    progressPercent,
    resetSeries,
    selectSeries,
    stats,
    submitAnswer,
    totalCount,
    unlockNextSeries,
  } = useQuizEngine(phrases);

  useEffect(() => {
    getGreekVoiceName().then(setGreekVoiceName);
  }, []);

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
          masteredCount={masteredCount}
          progressPercent={progressPercent}
          series={currentSeries}
          totalCount={totalCount}
        />
        <SeriesSelector
          currentSeries={currentSeries}
          progressBySeries={progressBySeries}
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
                options={current.options}
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
              Série {currentSeries + 1} débloquée. Tu as maîtrisé les {totalCount} phrases de cette
              série.
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
              <button
                type="button"
                onClick={unlockNextSeries}
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#e7c982]/30 bg-[#e7c982]/12 px-5 text-sm font-bold text-[#e7c982] transition hover:bg-[#e7c982]/20 focus:outline-none focus:ring-2 focus:ring-[#e7c982]/45 focus:ring-offset-2 focus:ring-offset-[#18211f]"
              >
                Passer à la série {Math.min(currentSeries + 1, 10)}
              </button>
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
