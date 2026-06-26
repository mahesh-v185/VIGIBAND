
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, LineChart, Line
} from 'recharts';

export const MarketChart: React.FC = () => {
  const data = [
    { name: '2026', value: 20 },
    { name: '2027', value: 45 },
    { name: '2028', value: 110 },
    { name: '2029', value: 280 },
    { name: '2030', value: 650 },
  ];

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
          <Tooltip 
            cursor={{ fill: '#334155', opacity: 0.1 }}
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Bar dataKey="value" fill="#38bdf8" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PriceComparison: React.FC = () => {
  const data = [
    { name: 'Apple Watch', price: 40000, color: '#1e293b' },
    { name: 'Imported Med', price: 15000, color: '#ef4444' },
    { name: 'VigiBand', price: 3999, color: '#38bdf8' },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
          <XAxis type="number" stroke="#555" fontSize={10} hide />
          <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Bar dataKey="price" radius={[0, 8, 8, 0]} barSize={32}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const RevenueGoal: React.FC = () => {
  const data = [
    { name: 'Q1', rev: 20 },
    { name: 'Q2', rev: 50 },
    { name: 'Q3', rev: 120 },
    { name: 'Q4', rev: 400 },
  ];

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
          <Tooltip 
             contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
          />
          <Line type="monotone" dataKey="rev" stroke="#38bdf8" strokeWidth={4} dot={{ fill: '#38bdf8', r: 6 }} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
