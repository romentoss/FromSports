import { render, screen, fireEvent } from '@testing-library/react';
import WorkoutList from './WorkoutList';

describe('WorkoutList', () => {
  const workouts = [
    { id: 1, name: 'Banca', weight: 50, reps: 10, sets: 3, date: new Date().toISOString() },
    { id: 2, name: 'Sentadilla', weight: 80, reps: 8, sets: 4, date: new Date().toISOString() },
  ];
  it('renderiza la lista de workouts', () => {
    render(<WorkoutList workouts={workouts} setEditingWorkout={() => {}} deleteWorkout={() => {}} />);
    expect(screen.getByText(/Banca/i)).toBeInTheDocument();
    expect(screen.getByText(/Sentadilla/i)).toBeInTheDocument();
  });

  it('llama a setEditingWorkout al hacer click en Edit', () => {
    const setEditingWorkout = jest.fn();
    render(<WorkoutList workouts={workouts} setEditingWorkout={setEditingWorkout} deleteWorkout={() => {}} />);
    fireEvent.click(screen.getAllByText(/Edit/i)[0]);
    expect(setEditingWorkout).toHaveBeenCalledWith(workouts[0]);
  });

  it('llama a deleteWorkout al hacer click en Delete', () => {
    const deleteWorkout = jest.fn();
    render(<WorkoutList workouts={workouts} setEditingWorkout={() => {}} deleteWorkout={deleteWorkout} />);
    fireEvent.click(screen.getAllByText(/Delete/i)[0]);
    expect(deleteWorkout).toHaveBeenCalledWith(workouts[0].id);
  });
});