import React from 'react';
import { Layers, Clock, CheckCircle2, AlertTriangle, Flame, Sparkles } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const StatsOverview = () => {
  const { stats, loading, filters, setFilters } = useTasks();

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const statCards = [
    {
      id: 'all',
      title: 'Total Tasks',
      value: stats.total,
      icon: <Layers className="w-4 h-4 text-indigo-400" />,
      bgIcon: 'from-indigo-500/20 to-indigo-500/5',
      borderColor: 'hover:border-indigo-500/50',
      activeBorder: 'border-indigo-500 bg-indigo-950/30',
      filterKey: 'status',
      filterVal: 'all',
      subtext: 'Workspace total',
    },
    {
      id: 'pending',
      title: 'To Do',
      value: stats.pending,
      icon: <Clock className="w-4 h-4 text-slate-400" />,
      bgIcon: 'from-slate-500/20 to-slate-500/5',
      borderColor: 'hover:border-slate-500/50',
      activeBorder: 'border-slate-400 bg-slate-900/60',
      filterKey: 'status',
      filterVal: 'pending',
      subtext: 'Pending start',
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      value: stats.inProgress,
      icon: <Flame className="w-4 h-4 text-amber-400" />,
      bgIcon: 'from-amber-500/20 to-amber-500/5',
      borderColor: 'hover:border-amber-500/50',
      activeBorder: 'border-amber-500 bg-amber-950/30',
      filterKey: 'status',
      filterVal: 'in-progress',
      subtext: 'Currently active',
    },
    {
      id: 'completed',
      title: 'Completed',
      value: stats.completed,
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      bgIcon: 'from-emerald-500/20 to-emerald-500/5',
      borderColor: 'hover:border-emerald-500/50',
      activeBorder: 'border-emerald-500 bg-emerald-950/30',
      filterKey: 'status',
      filterVal: 'completed',
      subtext: `${stats.completionRate}% finished`,
    },
    {
      id: 'high',
      title: 'High Priority',
      value: stats.highPriority,
      icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
      bgIcon: 'from-rose-500/20 to-rose-500/5',
      borderColor: 'hover:border-rose-500/50',
      activeBorder: 'border-rose-500 bg-rose-950/30',
      filterKey: 'priority',
      filterVal: 'high',
      subtext: 'Needs focus',
    },
  ];

  // SVG Circular progress radius & circumference
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stats.completionRate / 100) * circumference;

  const handleCardClick = (card) => {
    if (card.filterKey === 'status') {
      setFilters((prev) => ({
        ...prev,
        status: prev.status === card.filterVal ? 'all' : card.filterVal,
      }));
    } else if (card.filterKey === 'priority') {
      setFilters((prev) => ({
        ...prev,
        priority: prev.priority === card.filterVal ? 'all' : card.filterVal,
      }));
    }
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Banner with Progress Gauge */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-800/90 relative overflow-hidden bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-teal-950/30">
        
        {/* Glow ambient circle */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{getGreeting()}!</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {stats.completed === stats.total && stats.total > 0
                ? 'All caught up! Outstanding job! 🌟'
                : `You've completed ${stats.completed} of ${stats.total} tasks.`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg">
              {stats.highPriority > 0
                ? `You have ${stats.highPriority} high-priority task${stats.highPriority > 1 ? 's' : ''} waiting for your review.`
                : 'Your task velocity looks fantastic today. Keep crushing your goals!'}
            </p>
          </div>

          {/* Circular SVG Gauge */}
          <div className="flex items-center gap-4 self-center md:self-auto bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 shrink-0">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 70 70">
                <circle
                  cx="35"
                  cy="35"
                  r={radius}
                  className="text-slate-800"
                  strokeWidth="6"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="35"
                  cy="35"
                  r={radius}
                  className="text-teal-400 transition-all duration-700 ease-out"
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-xs font-black text-white">
                {stats.completionRate}%
              </span>
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-slate-200 block">Task Efficiency</span>
              <span className="text-[11px] text-teal-400 font-medium">
                {stats.completed}/{stats.total} Done
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Interactive Clickable Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statCards.map((card) => {
          const isActive =
            (card.filterKey === 'status' && filters.status === card.filterVal) ||
            (card.filterKey === 'priority' && filters.priority === card.filterVal);

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleCardClick(card)}
              className={`glass-panel p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                isActive
                  ? card.activeBorder + ' shadow-lg scale-[1.02]'
                  : 'border-slate-800/80 hover:border-slate-700 bg-slate-900/40'
              } ${card.borderColor}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400">{card.title}</span>
                <div className={`p-1.5 rounded-lg bg-gradient-to-br ${card.bgIcon}`}>
                  {card.icon}
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {loading ? '—' : card.value}
              </div>
              <p className="text-[10px] text-slate-500 mt-1 truncate">{card.subtext}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StatsOverview;
