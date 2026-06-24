export interface GreekPhrase {
  id: string;
  series: number;
  greek: string;
  transliteration?: string;
  translation: string;
  options: string[];
  difficulty: number;
}

export interface QuizExercise {
  id: string;
  title: string;
  description: string;
  mode?: "quiz";
  seriesLabels: Record<number, string>;
  phrases: GreekPhrase[];
}

export interface AssistedReadingSentence {
  id: string;
  greek: string;
  translation: string;
}

export interface AssistedReadingChapter {
  id: string;
  number: number;
  label: string;
  title: string;
  sentences: AssistedReadingSentence[];
}

export interface AssistedReadingExercise {
  id: string;
  title: string;
  description: string;
  mode: "assisted-reading";
  bookTitle: string;
  author: string;
  chapters: AssistedReadingChapter[];
}

export type GreekExercise = QuizExercise | AssistedReadingExercise;
