import { useState } from "react";

interface QuizOptionsProps {
  options: string[];
  correctAnswer: string;
  onAnswer: (correct: boolean) => void;
  disabled?: boolean;
}

export default function QuizOptions({ options, correctAnswer, onAnswer, disabled }: QuizOptionsProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (opt: string) => {
    if (disabled || revealed) return;
    setSelected(opt);
    setRevealed(true);
    const isCorrect = opt === correctAnswer;
    onAnswer(isCorrect);
  };

  const getButtonClasses = (opt: string) => {
    const base = "w-full text-left px-5 py-4 rounded-xl border-2 text-base font-medium transition active:scale-[0.98]";
    if (!revealed) {
      return `${base} bg-white border-slate-200 text-slate-800 hover:border-sky-400 hover:bg-sky-50`;
    }
    if (opt === correctAnswer) {
      return `${base} bg-emerald-50 border-emerald-500 text-emerald-800`;
    }
    if (opt === selected) {
      return `${base} bg-rose-50 border-rose-500 text-rose-800`;
    }
    return `${base} bg-white border-slate-200 text-slate-400`;
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => handleSelect(opt)}
          disabled={revealed}
          className={getButtonClasses(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
