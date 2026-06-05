let cachedGreekVoice: SpeechSynthesisVoice | null = null;
let speakRequestId = 0;

function getVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!("speechSynthesis" in window)) return Promise.resolve([]);

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) return Promise.resolve(voices);

  return new Promise((resolve) => {
    const timeout = window.setTimeout(() => {
      window.speechSynthesis.onvoiceschanged = null;
      resolve(window.speechSynthesis.getVoices());
    }, 1800);

    window.speechSynthesis.onvoiceschanged = () => {
      window.clearTimeout(timeout);
      window.speechSynthesis.onvoiceschanged = null;
      resolve(window.speechSynthesis.getVoices());
    };
  });
}

function normalize(value: string): string {
  return value.toLowerCase().replace("_", "-");
}

function scoreGreekVoice(voice: SpeechSynthesisVoice): number {
  const lang = normalize(voice.lang);
  const name = normalize(voice.name);
  let score = 0;

  if (lang === "el-gr") score += 100;
  if (lang.startsWith("el-")) score += 80;
  if (lang === "el") score += 70;
  if (name.includes("greek")) score += 35;
  if (name.includes("stefanos") || name.includes("helena")) score += 25;
  if (voice.localService) score += 3;

  return score;
}

function findGreekVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (cachedGreekVoice && voices.some((voice) => voice.name === cachedGreekVoice?.name)) {
    return cachedGreekVoice;
  }

  const candidates = voices
    .map((voice) => ({ voice, score: scoreGreekVoice(voice) }))
    .filter((candidate) => candidate.score >= 70)
    .sort((a, b) => b.score - a.score);

  cachedGreekVoice = candidates[0]?.voice ?? null;
  return cachedGreekVoice;
}

export async function getGreekVoiceName(): Promise<string | null> {
  const voice = findGreekVoice(await getVoices());
  return voice ? `${voice.name} (${voice.lang})` : null;
}

export async function getAvailableVoiceNames(): Promise<string[]> {
  return (await getVoices()).map((voice) => `${voice.name} (${voice.lang})`);
}

export async function speak(text: string): Promise<boolean> {
  if (!("speechSynthesis" in window)) return false;

  const requestId = ++speakRequestId;
  window.speechSynthesis.cancel();

  const voices = await getVoices();
  if (requestId !== speakRequestId) return false;

  const greekVoice = findGreekVoice(voices);
  if (!greekVoice) return false;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "el-GR";
  utterance.voice = greekVoice;
  utterance.rate = 0.88;
  utterance.pitch = 1;

  await new Promise<void>((resolve) => {
    const timeout = window.setTimeout(resolve, 2600);
    const finish = () => {
      window.clearTimeout(timeout);
      resolve();
    };
    utterance.onend = finish;
    utterance.onerror = finish;
    window.speechSynthesis.speak(utterance);
  });

  return true;
}

export function stop(): void {
  speakRequestId++;
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
