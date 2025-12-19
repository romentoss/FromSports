import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function WorkoutChart({data}) {
  if (!data || data.length === 0)
    return (
      <p style={{textAlign: 'center', color: '#64748b'}}>
        No hay datos para graficar
      </p>
    );

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(tick) => tick} />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis yAxisId="right" orientation="right" hide />
          <Tooltip
            labelFormatter={(label) => `Fecha: ${label}`}
            formatter={(value, name) => {
              if (name === 'weight') return [`${value} kg`, 'Peso'];
              if (name === 'sets') return [`${value}`, 'Series'];
              if (name === 'reps') return [`${value}`, 'Repeticiones'];
              return [value, name];
            }}
          />
          <Line
            type="monotone"
            dataKey="weight"
            name="Peso (kg)"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{r: 5}}
            yAxisId="left"
          />
          <Line
            type="monotone"
            dataKey="sets"
            name="Series"
            stroke="#f59e42"
            strokeWidth={2}
            dot={{r: 4}}
            yAxisId="right"
          />
          <Line
            type="monotone"
            dataKey="reps"
            name="Repeticiones"
            stroke="#10b981"
            strokeWidth={2}
            dot={{r: 4}}
            yAxisId="right"
          />
        </LineChart>
      </ResponsiveContainer>
      <div style={{textAlign: 'center', marginTop: 8}}>
        <span style={{color: '#6366f1', fontWeight: 600}}>Peso</span>
        {' | '}
        <span style={{color: '#f59e42', fontWeight: 600}}>Series</span>
        {' | '}
        <span style={{color: '#10b981', fontWeight: 600}}>Repeticiones</span>
      </div>
    </div>
  );
}

export default WorkoutChart;
