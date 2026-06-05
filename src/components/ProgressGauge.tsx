interface ProgressGaugeProps {
  progress: number;
  streak: number;
}

export default function ProgressGauge({ progress, streak }: ProgressGaugeProps) {
  return (
    <div className="flex items-center justify-between w-full px-1">
      <div className="flex-1 mr-4">
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-sky-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs text-slate-500 mt-1">{progress}% completed</div>
      </div>
      {streak > 0 && (
        <div className="flex items-center gap-1 text-amber-600 font-semibold text-sm">
          <span>🔥</span>
          <span>{streak}</span>
        </div>
      )}
    </div>
  );
}
