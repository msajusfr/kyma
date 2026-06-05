# Kyma

Learn Greek naturally.

Kyma is a minimalist web application for learning modern Greek through short sentence quizzes, audio pronunciation, and progressive repetition.

The goal is to create a very fast, simple, and immersive learning experience inspired by natural language exposure rather than traditional lessons.

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Web Speech API
- localStorage

No backend. No authentication. No external database.

## Features

### Sentence-based learning
Users learn Greek through short everyday sentences.

Example:
```Καλημέρα```

Users must choose the correct translation among multiple choices.

### Audio pronunciation
Every sentence can be pronounced directly in the browser using the Web Speech API.

Greek voice: `el-GR`

Audio can be replayed using a speaker icon.

### Progressive series
The application is organized into progressive series:

- Series 1 → very simple Greek
- Series 2 → simple conversation
- Series 3 → more natural structures
- ...
- Series 10 → natural daily Greek

Each series contains approximately: **100 phrases**

### Intelligent repetition
Incorrect answers reappear later. Correct answers become less frequent. The objective is to reinforce memory naturally through repetition.

### Mobile first
Kyma is designed primarily for mobile devices:
- clean UI
- large text
- fast interactions
- minimal navigation
- instant audio playback

## Project Structure

```
src/
  components/
    AudioButton.tsx
    PhraseCard.tsx
    QuizOptions.tsx
    ProgressGauge.tsx
    SeriesHeader.tsx

  data/
    phrases.ts

  hooks/
    useQuizEngine.ts
    useLocalStorage.ts

  services/
    speechService.ts

  types/
    GreekPhrase.ts

  pages/
    QuizPage.tsx

  App.tsx
```

## Data Model

```ts
export interface GreekPhrase {
  id: string;
  series: number;
  greek: string;
  transliteration?: string;
  translation: string;
  options: string[];
  difficulty: number;
}
```

## Development

Install dependencies:
```bash
npm install
```

Run locally:
```bash
npm run dev
```

Build production version:
```bash
npm run build
```

## Philosophy

Kyma is intentionally simple.

The project prioritizes:
- immersion
- speed
- clarity
- maintainability
- minimal dependencies
- natural repetition

The goal is not to create a complex educational platform, but a lightweight and enjoyable daily Greek training tool.

## Future Ideas

- thousands of phrases
- adaptive difficulty
- spaced repetition
- offline PWA
- statistics
- listening-only mode
- typing mode
- cloud sync
- phrase packs
- AI-generated phrase variations

## License

MIT
