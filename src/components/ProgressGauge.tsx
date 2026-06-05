interface ProgressGaugeProps {
  value: number;
}

export default function ProgressGauge({ value }: ProgressGaugeProps) {
  return (
    <div
      className="h-2 overflow-hidden rounded-full bg-white/10"
      aria-label={`Progression ${value}%`}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#2ea6a0] via-[#9fb27b] to-[#e7c982] transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
