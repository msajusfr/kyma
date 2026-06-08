import { advancedGreekQuizPhrases, advancedGreekQuizSeriesLabels } from "./advancedGreekQuiz";
import { keaShoppingPhrases } from "./keaShoppingPhrases";
import { phrases as levelTestPhrases } from "./phrases";
import type { GreekExercise } from "../types/GreekPhrase";

export const exercises: GreekExercise[] = [
  {
    id: "level-test-1-10",
    title: "Test de niveau 1-10",
    description: "Progression générale pour mesurer et renforcer ton grec au quotidien.",
    seriesLabels: {
      1: "Bases",
      2: "Mini conversations",
      3: "Vie quotidienne",
      4: "Conversations",
      5: "Nuances",
      6: "Oral naturel",
      7: "Fluide",
      8: "Grec vivant",
      9: "Lecture rapide",
      10: "Immersion",
    },
    phrases: levelTestPhrases,
  },
  {
    id: "kea-shopping-level-1",
    title: "Faire ses courses à Kea",
    description: "Niveau débutant pour acheter au supermarché, chez le boucher et chez le boulanger.",
    seriesLabels: {
      1: "Supermarché",
      2: "Boucher",
      3: "Boulanger",
    },
    phrases: keaShoppingPhrases,
  },
  {
    id: "advanced-greek-quiz-10000",
    title: "Quiz grec avancé",
    description: "10 000 phrases courtes en quiz de traduction, par blocs de 1 000 phrases.",
    seriesLabels: advancedGreekQuizSeriesLabels,
    phrases: advancedGreekQuizPhrases,
  },
];
