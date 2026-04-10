import { createContext, useContext } from 'react';

interface ExerciseContextValue {
  hintsDisabled: boolean;
}

const ExerciseContext = createContext<ExerciseContextValue>({ hintsDisabled: false });

export const ExerciseProvider = ExerciseContext.Provider;
export const useExerciseContext = () => useContext(ExerciseContext);
