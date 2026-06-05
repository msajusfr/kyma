import ProgressGauge from "./ProgressGauge";

interface SeriesHeaderProps {
  masteredCount: number;
  progressPercent: number;
  series: number;
  totalCount: number;
}

export default function SeriesHeader({
  masteredCount,
  progressPercent,
  series,
  totalCount,
}: SeriesHeaderProps) {
  return (
    <header className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#e7c982]/75">
          Greek Quiz Trainer
        </p>
        <div className="mt-2 flex items-center gap-3">
          <img
            src="/kyma-logo.png"
            alt=""
            aria-hidden="true"
            className="h-12 w-24 object-contain md:h-14 md:w-28"
          />
          <h1 className="text-4xl font-bold tracking-tight text-[#f4efe2] md:text-5xl">
            Kyma
          </h1>
        </div>
      </div>
      <div className="w-full max-w-sm md:text-right">
        <div className="mb-2 flex items-baseline justify-between gap-4 md:justify-end">
          <p className="text-sm font-semibold text-[#f4efe2]/72">Série {series}</p>
          <p className="text-sm text-[#f4efe2]/55">
            {masteredCount} / {totalCount} maîtrisées
          </p>
        </div>
        <ProgressGauge value={progressPercent} />
      </div>
    </header>
  );
}
