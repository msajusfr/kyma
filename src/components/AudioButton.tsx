import { useState } from "react";
import { speak } from "../services/speechService";

interface AudioButtonProps {
  text: string;
}

export default function AudioButton({ text }: AudioButtonProps) {
  const [status, setStatus] = useState<"idle" | "playing" | "missing">("idle");

  const handleClick = async () => {
    setStatus("playing");
    const didSpeak = await speak(text);
    setStatus(didSpeak ? "idle" : "missing");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex min-h-12 min-w-12 items-center justify-center rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-[#e7c982]/45 focus:ring-offset-2 focus:ring-offset-[#18211f] active:scale-95 ${
        status === "missing"
          ? "border-red-300/35 bg-red-500/10 text-red-200"
          : "border-[#e7c982]/25 bg-[#e7c982]/10 text-[#e7c982] hover:bg-[#e7c982]/20"
      } ${status === "playing" ? "bg-[#e7c982]/20" : ""}`}
      aria-label={status === "missing" ? "Voix grecque absente" : "Écouter la phrase"}
      title={status === "missing" ? "Aucune vraie voix grecque n'est disponible" : "Écouter"}
    >
      <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 9v6h4l5 4V5L9 9H5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M17 9.5a4 4 0 0 1 0 5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {status === "missing" ? (
          <path
            d="M4 4l16 16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        ) : null}
      </svg>
    </button>
  );
}
