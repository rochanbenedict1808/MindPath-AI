
import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { EmotionData, TrendData } from '../types';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const EmotionPieChart: React.FC<{ data: EmotionData[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
);

export const SentimentTrendChart: React.FC<{ data: TrendData[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="segment" label={{ value: 'Timeline Content Blocks', position: 'insideBottom', offset: -5 }} />
      <YAxis domain={[-1, 1]} label={{ value: 'Sentiment Polarity', angle: -90, position: 'insideLeft' }} />
      <Tooltip />
      <Area type="monotone" dataKey="sentiment" stroke="#6366f1" fillOpacity={1} fill="url(#colorSentiment)" />
    </AreaChart>
  </ResponsiveContainer>
);

export const StressIndicator: React.FC<{ value: number }> = ({ value }) => {
  const getStatusColor = (v: number) => {
    if (v < 30) return 'text-green-500';
    if (v < 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-slate-100">
      <div className={`text-5xl font-bold mb-2 ${getStatusColor(value)}`}>{value}</div>
      <div className="text-slate-500 font-medium uppercase tracking-wider text-sm">Stress Index</div>
      <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${value < 30 ? 'bg-green-500' : value < 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};
