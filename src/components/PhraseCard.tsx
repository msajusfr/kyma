import { useEffect } from "react";
import type { GreekPhrase } from "../types/GreekPhrase";
import { speak, stop } from "../services/speechService";
import AudioButton from "./AudioButton";

interface PhraseCardProps {
  phrase: GreekPhrase;
}

export default function PhraseCard({ phrase }: PhraseCardProps) {
  const greekTextSize = getGreekTextSize(phrase.greek);

  useEffect(() => {
    speak(phrase.greek);
    return stop;
  }, [phrase.id, phrase.greek]);

  return (
    <section className="relative overflow-hidden rounded-xl border border-white/10 bg-[#18211f]/95 shadow-[0_24px_80px_rgba(0,0,0,0.34)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e7c982]/55 to-transparent" />
      <div className="flex min-h-[220px] items-center justify-between gap-4 p-6 md:min-h-[280px] md:p-8">
        <div className="min-w-0 flex-1">
          <p className={`${greekTextSize} whitespace-normal font-bold leading-snug tracking-normal text-[#f4efe2] [overflow-wrap:normal]`}>
            {phrase.greek}
          </p>
          {phrase.transliteration ? (
            <p className="mt-4 text-lg font-semibold leading-7 text-[#e7c982]/70 md:text-2xl">
              {phrase.transliteration}
            </p>
          ) : null}
        </div>
        <AudioButton text={phrase.greek} />
      </div>
    </section>
  );
}

function getGreekTextSize(text: string) {
  const words = text.split(/\s+/);
  const longestWordLength = words.reduce(
    (longest, word) => Math.max(longest, word.replace(/[.,;!?·]/g, "").length),
    0
  );
  const length = text.length;

  if (length >= 140) return "text-xl md:text-5xl";
  if (length >= 110) return "text-2xl md:text-6xl";
  if (length >= 82) return "text-3xl md:text-7xl";
  if (length >= 58) return "text-4xl md:text-7xl";
  if (longestWordLength >= 16) return "text-3xl md:text-7xl";
  if (longestWordLength >= 12) return "text-4xl md:text-7xl";
  if (longestWordLength >= 10) return "text-[2.75rem] md:text-8xl";

  return "text-5xl md:text-8xl";
}
