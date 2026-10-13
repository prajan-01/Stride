import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';

interface BenchmarkComparison {
  tier: string;
  value: number;
}

interface BenchmarkBarChartProps {
  athleteValue: number;
  unit: string;
  metricName: string;
  comparisons?: BenchmarkComparison[];
}

export const BenchmarkBarChart: React.FC<BenchmarkBarChartProps> = ({
  athleteValue = 68.5,
  unit = 'cm',
  metricName = 'Vertical Jump',
  comparisons = [
    { tier: 'Grassroots Tier', value: 42.0 },
    { tier: 'District Avg', value: 49.5 },
    { tier: 'State Camp', value: 58.0 },
    { tier: 'National Elite', value: 65.0 },
    { tier: 'Current Attempt', value: athleteValue },
  ],
}) => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={comparisons} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="tier"
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: '#1e293b' }}
          />
          <YAxis
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: '#1e293b' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0e141d',
              borderColor: '#273548',
              borderRadius: '12px',
              color: '#f8fafc',
            }}
            formatter={(value: any) => [`${value} ${unit}`, metricName]}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {comparisons.map((entry, index) => {
              const isAthlete = entry.tier === 'Current Attempt';
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={isAthlete ? '#a3e635' : '#273548'}
                  className={isAthlete ? 'filter drop-shadow-[0_0_8px_rgba(163,230,53,0.4)]' : ''}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
