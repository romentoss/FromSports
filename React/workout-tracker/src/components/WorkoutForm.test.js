import { render, screen, fireEvent } from '@testing-library/react';
import WorkoutForm from './WorkoutForm';

describe('WorkoutForm', () => {
  it('renderiza el input y el botón', () => {
    render(<WorkoutForm />);
    expect(screen.getByPlaceholderText(/Ejercicio/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Agregar/i })).toBeInTheDocument();
  });

  it('permite escribir en el input', () => {
    render(<WorkoutForm />);
    const input = screen.getByPlaceholderText(/Ejercicio/i);
    fireEvent.change(input, { target: { value: 'Sentadilla' } });
    expect(input.value).toBe('Sentadilla');
  });

  it('llama a handleSubmit al enviar el formulario', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<WorkoutForm />);
    const input = screen.getByPlaceholderText(/Ejercicio/i);
    fireEvent.change(input, { target: { value: 'Press banca' } });
    fireEvent.click(screen.getByRole('button', { name: /Agregar/i }));
    expect(consoleSpy).toHaveBeenCalledWith('Ejercicio:', 'Press banca');
    consoleSpy.mockRestore();
  });
});