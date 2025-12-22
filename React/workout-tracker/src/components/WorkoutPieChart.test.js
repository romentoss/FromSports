import React from 'react';
import { render, screen } from '@testing-library/react';
import WorkoutPieChart from './WorkoutPieChart';

describe('WorkoutPieChart', () => {
  const mockData = [
    { date: '12/03/2026', weight: 100, sets: 4, reps: 10 },
    { date: '13/03/2026', weight: 110, sets: 5, reps: 12 },
  ];

  it('renders without crashing and shows chart container', () => {
    render(<WorkoutPieChart data={mockData} />);
    // Chart container should be present
    expect(screen.getByRole('region', { name: /chart/i })).toBeInTheDocument();
  });

  it('shows no data message if data is empty', () => {
    render(<WorkoutPieChart data={[]} />);
    expect(screen.getByText(/no hay datos para graficar/i)).toBeInTheDocument();
  });
});
