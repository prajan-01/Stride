import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';

interface RadarDataPoint {
  subject: string;
  score: number;
  benchmark: number;
}

const DEFAULT_RADAR_DATA: RadarDataPoint[] = [
  { subject: 'Explosive Power', score: 96, benchmark: 75 },
  { subject: 'Speed (30m)', score: 98, benchmark: 78 },
  { subject: 'Endurance (VO2)', score: 86, benchmark: 70 },
  { subject: 'Push-up Core', score: 92, benchmark: 72 },
  { subject: 'Flexibility', score: 79, benchmark: 65 },
  { subject: 'Broad Jump', score: 94, benchmark: 74 },
];

export const PerformanceRadarChart: React.FC<{ data?: RadarDataPoint[] }> = ({
  data = DEFAULT_RADAR_DATA,
}) => {
  return (
    <div className="w-full h-72 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#1f2d3d" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            stroke="#334155"
            tick={{ fill: '#64748b', fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0e141d',
              borderColor: '#273548',
              borderRadius: '12px',
              color: '#f8fafc',
            }}
          />
          <Radar
            name="Aarav's Profile"
            dataKey="score"
            stroke="#a3e635"
            fill="#a3e635"
            fillOpacity={0.35}
            strokeWidth={2}
          />
          <Radar
            name="SAI National Camp Standard"
            dataKey="benchmark"
            stroke="#38bdf8"
            fill="#38bdf8"
            fillOpacity={0.12}
            strokeWidth={1.5}
            strokeDasharray="3 3"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
