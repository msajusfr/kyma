export interface GreekPhrase {
  id: string;
  series: number;
  greek: string;
  transliteration?: string;
  translation: string;
  options: string[];
  difficulty: number;
}

export interface GreekExercise {
  id: string;
  title: string;
  description: string;
  seriesLabels: Record<number, string>;
  phrases: GreekPhrase[];
}
