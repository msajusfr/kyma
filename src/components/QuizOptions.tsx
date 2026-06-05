interface QuizOptionsProps {
  options: string[];
  correctAnswer: string;
  disabled: boolean;
  onAnswer: (answer: string) => void;
  selectedAnswer: string | null;
}

export default function QuizOptions({
  options,
  correctAnswer,
  disabled,
  onAnswer,
  selectedAnswer,
}: QuizOptionsProps) {
  const getButtonClasses = (option: string) => {
    const base =
      "w-full rounded-lg border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-[#e7c982]/45 focus:ring-offset-2 focus:ring-offset-[#18211f] active:scale-[0.99]";

    if (!disabled) {
      return `${base} border-white/8 bg-white/[0.045] hover:border-[#e7c982]/35 hover:bg-white/[0.075]`;
    }

    if (option === correctAnswer) {
      return `${base} border-[#9fb27b]/70 bg-[#9fb27b]/18`;
    }

    if (option === selectedAnswer) {
      return `${base} border-red-400/65 bg-red-500/12`;
    }

    return `${base} border-white/8 bg-white/[0.03] opacity-45`;
  };

  return (
    <div className="grid gap-2.5">
      {options.map((option, index) => (
        <button
          key={option}
          type="button"
          disabled={disabled}
          onClick={() => onAnswer(option)}
          className={getButtonClasses(option)}
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.055] text-xs font-bold text-[#e7c982]/85">
              {String.fromCharCode(65 + index)}
            </span>
            <span className="min-w-0 text-base font-semibold text-[#f4efe2]">{option}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
