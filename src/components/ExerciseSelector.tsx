import type { GreekExercise } from "../types/GreekPhrase";

interface ExerciseSelectorProps {
  currentExerciseId: string;
  exercises: GreekExercise[];
  onSelectExercise: (exerciseId: string) => void;
}

export default function ExerciseSelector({
  currentExerciseId,
  exercises,
  onSelectExercise,
}: ExerciseSelectorProps) {
  return (
    <section className="mb-4 rounded-xl border border-white/10 bg-[#18211f]/80 p-3 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
      <div className="grid gap-2 md:grid-cols-2">
        {exercises.map((exercise) => {
          const active = exercise.id === currentExerciseId;

          return (
            <button
              key={exercise.id}
              type="button"
              onClick={() => onSelectExercise(exercise.id)}
              className={`rounded-lg border px-4 py-3 text-left transition active:scale-[0.99] ${
                active
                  ? "border-[#e7c982]/45 bg-[#e7c982]/12 text-[#f4efe2]"
                  : "border-white/8 bg-white/[0.04] text-[#f4efe2]/70 hover:border-[#e7c982]/25 hover:bg-white/[0.07]"
              }`}
            >
              <span className="block text-sm font-bold text-[#f4efe2]">{exercise.title}</span>
              <span className="mt-1 block text-xs leading-5 text-[#f4efe2]/55">
                {exercise.description}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
