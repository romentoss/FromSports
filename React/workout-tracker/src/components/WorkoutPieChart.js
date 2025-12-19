import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#6366f1', '#f59e42', '#10b981'];
const LABELS = ['Peso', 'Series', 'Repeticiones'];

function WorkoutPieChart({data}) {
  if (!data || data.length === 0)
    return (
      <p style={{textAlign: 'center', color: '#64748b'}}>
        No hay datos para graficar
      </p>
    );

  // Sumar totales de cada métrica
  const totals = [
    data.reduce((acc, d) => acc + (d.weight || 0), 0),
    data.reduce((acc, d) => acc + (d.sets || 0), 0),
    data.reduce((acc, d) => acc + (d.reps || 0), 0),
  ];
  const pieData = LABELS.map((label, i) => ({name: label, value: totals[i]}));

  return (
    <div className="chart-container" role="region" aria-label="chart">
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {pieData.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WorkoutPieChart;
