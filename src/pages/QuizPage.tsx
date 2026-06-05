import { useState, useMemo } from "react";
import { phrases } from "../data/phrases";
import { useQuizEngine } from "../hooks/useQuizEngine";
import SeriesHeader from "../components/SeriesHeader";
import PhraseCard from "../components/PhraseCard";
import QuizOptions from "../components/QuizOptions";
import ProgressGauge from "../components/ProgressGauge";

export default function QuizPage() {
  const [selectedSeries, setSelectedSeries] = useState<number>(1);

  const seriesPhrases = useMemo(
    () => phrases.filter((p) => p.series === selectedSeries),
    [selectedSeries]
  );

  const { current, streak, progress, answer, reset, remaining } = useQuizEngine(seriesPhrases);

  if (seriesPhrases.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center text-slate-600">No phrases in this series yet.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 sm:p-6">
      <div className="w-full max-w-md flex flex-col gap-5">
        <SeriesHeader series={selectedSeries} />

        <ProgressGauge progress={progress} streak={streak} />

        {current ? (
          <>
            <PhraseCard phrase={current} />
            <QuizOptions
              options={current.options}
              correctAnswer={current.translation}
              onAnswer={(correct) => answer(current.id, correct)}
            />
            <div className="text-center text-xs text-slate-400">
              {remaining} phrase{remaining !== 1 ? "s" : ""} remaining in queue
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow border border-slate-100 text-center">
            <div className="text-5xl">🎉</div>
            <h2 className="text-xl font-bold text-slate-900">Series complete!</h2>
            <p className="text-slate-600">You answered all phrases in this series.</p>
            <button
              onClick={reset}
              className="mt-2 px-6 py-3 rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-700 active:scale-95 transition"
            >
              Restart series
            </button>
          </div>
        )}

        {/* Series selector */}
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((s) => (
            <button
              key={s}
              onClick={() => {
                setSelectedSeries(s);
                reset();
              }}
              className={
                "px-3 py-1.5 rounded-lg text-sm font-medium border transition " +
                (selectedSeries === s
                  ? "bg-sky-600 text-white border-sky-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-sky-400")
              }
            >
              S{s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
