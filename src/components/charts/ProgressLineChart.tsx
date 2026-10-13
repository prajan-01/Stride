import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { PROGRESS_DATA } from '../../lib/mockData';

interface ProgressLineChartProps {
  data?: typeof PROGRESS_DATA;
}

export const ProgressLineChart: React.FC<ProgressLineChartProps> = ({ data = PROGRESS_DATA }) => {
  return (
    <div className="w-full h-72 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={{ stroke: '#1e293b' }}
          />
          <YAxis
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={{ stroke: '#1e293b' }}
            domain={[75, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0e141d',
              borderColor: '#273548',
              borderRadius: '12px',
              color: '#f8fafc',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
            }}
            labelStyle={{ color: '#a3e635', fontWeight: 'bold', marginBottom: '4px' }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '12px', fontSize: '12px' }}
            formatter={(value) => <span className="text-slate-300 font-medium">{value}</span>}
          />
          <Line
            type="monotone"
            dataKey="strideScore"
            name="Overall STRIDE Score"
            stroke="#a3e635"
            strokeWidth={3}
            dot={{ fill: '#a3e635', r: 4, strokeWidth: 2, stroke: '#070a0e' }}
            activeDot={{ r: 6, fill: '#bbf451' }}
          />
          <Line
            type="monotone"
            dataKey="percentile"
            name="National Percentile"
            stroke="#38bdf8"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={{ fill: '#38bdf8', r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
