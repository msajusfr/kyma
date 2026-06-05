export interface GreekPhrase {
  id: string;
  series: number;
  greek: string;
  transliteration?: string;
  translation: string;
  options: string[];
  difficulty: number;
}
