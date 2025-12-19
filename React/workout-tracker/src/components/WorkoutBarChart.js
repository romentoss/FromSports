import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

function WorkoutBarChart({data}) {
  if (!data || data.length === 0)
    return (
      <p style={{textAlign: 'center', color: '#64748b'}}>
        No hay datos para graficar
      </p>
    );

  return (
    <div className="chart-container" role="region" aria-label="chart">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="weight" name="Peso (kg)" fill="#6366f1" />
          <Bar dataKey="sets" name="Series" fill="#f59e42" />
          <Bar dataKey="reps" name="Repeticiones" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WorkoutBarChart;
