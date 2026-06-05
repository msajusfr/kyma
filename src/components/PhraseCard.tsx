import { GreekPhrase } from "../types/GreekPhrase";
import AudioButton from "./AudioButton";

interface PhraseCardProps {
  phrase: GreekPhrase;
}

export default function PhraseCard({ phrase }: PhraseCardProps) {
  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-2xl shadow border border-slate-100">
      <div className="text-4xl font-semibold text-slate-900 text-center leading-tight">
        {phrase.greek}
      </div>
      {phrase.transliteration && (
        <div className="text-lg text-slate-500 italic text-center">
          {phrase.transliteration}
        </div>
      )}
      <AudioButton text={phrase.greek} />
    </div>
  );
}
