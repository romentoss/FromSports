import { render, screen } from '@testing-library/react';
import WorkoutChart from './WorkoutChart';

describe('WorkoutChart', () => {
  it('muestra mensaje si no hay datos', () => {
    render(<WorkoutChart data={[]} />);
    expect(screen.getByText(/No hay datos para graficar/i)).toBeInTheDocument();
  });

  it('renderiza el gráfico si hay datos', () => {
    const data = [
      { date: '01/01/2024', weight: 50 },
      { date: '02/01/2024', weight: 60 },
    ];
    const { container } = render(<WorkoutChart data={data} />);
    // El gráfico de recharts no tiene texto visible, pero el contenedor sí existe
    expect(container.querySelector('.chart-container')).toBeInTheDocument();
  });
});