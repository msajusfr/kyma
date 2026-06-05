interface SeriesHeaderProps {
  series: number;
  totalSeries?: number;
}

export default function SeriesHeader({ series, totalSeries = 10 }: SeriesHeaderProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <h1 className="text-2xl font-bold text-slate-900">Kyma</h1>
      <div className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
        Series {series} / {totalSeries}
      </div>
    </div>
  );
}
