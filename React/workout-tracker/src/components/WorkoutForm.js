import React, {useState} from 'react';

function WorkoutForm() {
  const [exercise, setExercise] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Ejercicio:', exercise);
    // Aquí luego harás fetch a tu POST /workouts
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Ejercicio"
        value={exercise}
        onChange={(e) => setExercise(e.target.value)}
      />
      <button type="submit">Agregar</button>
    </form>
  );
}

export default WorkoutForm;
