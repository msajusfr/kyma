import { useEffect } from "react";
import type { GreekPhrase } from "../types/GreekPhrase";
import { speak, stop } from "../services/speechService";
import AudioButton from "./AudioButton";

interface PhraseCardProps {
  phrase: GreekPhrase;
}

export default function PhraseCard({ phrase }: PhraseCardProps) {
  useEffect(() => {
    speak(phrase.greek);
    return stop;
  }, [phrase.id, phrase.greek]);

  return (
    <section className="relative overflow-hidden rounded-xl border border-white/10 bg-[#18211f]/95 shadow-[0_24px_80px_rgba(0,0,0,0.34)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e7c982]/55 to-transparent" />
      <div className="flex min-h-[220px] items-center justify-between gap-4 p-6 md:min-h-[280px] md:p-8">
        <div className="min-w-0">
          <p className="text-5xl font-bold leading-none tracking-normal text-[#f4efe2] md:text-8xl">
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
