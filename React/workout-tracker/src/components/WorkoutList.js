import React from 'react';

function WorkoutList({workouts, setEditingWorkout, deleteWorkout}) {
  return (
    <>
      <h2 style={{color: '#6366f1', textAlign: 'center', marginBottom: 18}}>
        Workout List
      </h2>
      <div
        className="workout-list"
        style={{
          display: 'flex',
          gap: '9rem',
          flexWrap: 'wrap',
          width: '90%',
          justifyContent: 'center',
        }}
      >
        {workouts.map((w) => (
          <div key={w.id} className="workout-card">
            <p>
              <b>Exercise:</b> {w.name}
            </p>
            <p>
              <b>Weight:</b> {w.weight} kg
            </p>
            <p>
              <b>Reps:</b> {w.reps}
            </p>
            <p>
              <b>Sets:</b> {w.sets}
            </p>
            <p>
              <b>Date:</b> {new Date(w.date).toLocaleDateString('es-ES')}
            </p>
            <div>
              <button onClick={() => setEditingWorkout(w)}>Edit</button>
              <button onClick={() => deleteWorkout(w.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default WorkoutList;
