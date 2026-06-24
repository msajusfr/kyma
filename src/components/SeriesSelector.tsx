interface SeriesProgressItem {
  series: number;
  masteredCount: number;
  totalCount: number;
}

interface SeriesSelectorProps {
  currentSeries: number;
  progressBySeries: SeriesProgressItem[];
  seriesLabels: Record<number, string>;
  onSelectSeries: (series: number) => void;
}

export default function SeriesSelector({
  currentSeries,
  progressBySeries,
  seriesLabels,
  onSelectSeries,
}: SeriesSelectorProps) {
  return (
    <section className="mb-4 rounded-xl border border-white/10 bg-[#18211f]/80 p-3 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {progressBySeries.map(({ series, masteredCount, totalCount }) => {
          const active = series === currentSeries;
          const label = seriesLabels[series] ?? `Série ${series}`;
          const percent = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

          return (
            <button
              key={series}
              type="button"
              onClick={() => onSelectSeries(series)}
              aria-label={`Série ${series}, ${label}, ${masteredCount} sur ${totalCount}`}
              className={`min-w-36 rounded-lg border px-3 py-2 text-left transition active:scale-[0.99] ${
                active
                  ? "border-[#e7c982]/45 bg-[#e7c982]/12 text-[#f4efe2]"
                  : "border-white/8 bg-white/[0.04] text-[#f4efe2]/70 hover:border-[#e7c982]/25 hover:bg-white/[0.07]"
              }`}
            >
              <span className="block text-xs font-bold uppercase tracking-[0.16em] text-[#e7c982]/75">
                Série {series}
              </span>
              <span className="mt-1 block truncate text-sm font-semibold">{label}</span>
              <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-white/10">
                <span
                  className="block h-full rounded-full bg-gradient-to-r from-[#2ea6a0] to-[#e7c982]"
                  style={{ width: `${percent}%` }}
                />
              </span>
              <span className="mt-1 block text-xs text-[#f4efe2]/45">
                {masteredCount} / {totalCount}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
