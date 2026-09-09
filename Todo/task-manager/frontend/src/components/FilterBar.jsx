import React from 'react';
import { Search, Filter, ArrowUpDown, X, Sparkles } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const FilterBar = () => {
  const { filters, setFilters } = useTasks();

  const statusOptions = [
    { label: 'All Tasks', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Completed', value: 'completed' },
  ];

  const priorityOptions = [
    { label: 'All Priorities', value: 'all' },
    { label: 'High Priority', value: 'high' },
    { label: 'Medium Priority', value: 'medium' },
    { label: 'Low Priority', value: 'low' },
  ];

  const sortOptions = [
    { label: 'Newest First', value: 'createdAt' },
    { label: 'Due Date', value: 'dueDate' },
    { label: 'Priority', value: 'priority' },
  ];

  const hasActiveFilters =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.sortBy !== 'createdAt';

  const resetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      priority: 'all',
      sortBy: 'createdAt',
    });
  };

  return (
    <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800/80 mb-6 space-y-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/80 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdowns & Reset */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Priority Select */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={filters.priority}
              onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value }))}
              className="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/50 cursor-pointer transition-all"
            >
              {priorityOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
                  {opt.label}
                </option>
              ))}
            </select>
            <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Sort By Select */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
              className="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/50 cursor-pointer transition-all"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
                  Sort: {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-medium text-slate-300 hover:text-white border border-slate-700/50 transition-all"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-slate-800/60 pt-3">
        {statusOptions.map((tab) => {
          const isActive = filters.status === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setFilters((prev) => ({ ...prev, status: tab.value }))}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm shadow-teal-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterBar;
