'use client';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';

interface RiskChartProps {
  data: { category: string; count: number; avgScore: number }[];
  type?: 'bar' | 'radar';
}

const COLORS = ['#6366F1', '#F97316', '#34D399', '#3B82F6', '#A78BFA', '#FACC15', '#F87171'];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: {value: number}[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(8, 8, 20, 0.95)',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      borderRadius: 8,
      padding: '0.6rem 0.85rem',
      fontFamily: "'Outfit', sans-serif",
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
    }}>
      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </p>
      <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#818CF8' }}>
        {payload[0].value} {payload[0].value === 1 ? 'analysis' : 'analyses'}
      </p>
    </div>
  );
};

export default function RiskChart({ data, type = 'bar' }: RiskChartProps) {
  if (!data.length) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160, color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
      No data yet
    </div>
  );

  if (type === 'radar') {
    const radarData = data.map(d => ({ subject: d.category, A: d.avgScore, fullMark: 100 }));
    return (
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="rgba(255,255,255,0.08)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: "'Outfit', sans-serif" }} />
          <Radar name="Risk" dataKey="A" stroke="#6366F1" fill="#6366F1" fillOpacity={0.15} />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barSize={32} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis 
          dataKey="category" 
          tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: "'Outfit', sans-serif" }} 
          axisLine={false} 
          tickLine={false} 
          dy={10}
        />
        <YAxis 
          tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: "'Outfit', sans-serif" }} 
          axisLine={false} 
          tickLine={false} 
          dx={-10}
        />
        <Tooltip 
          content={<CustomTooltip />} 
          cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} 
        />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
