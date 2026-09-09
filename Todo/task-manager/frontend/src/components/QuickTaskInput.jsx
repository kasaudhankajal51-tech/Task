import React, { useState } from 'react';
import { Plus, Zap, CornerDownLeft, Calendar, Flag } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const QuickTaskInput = () => {
  const { quickAddTask } = useTasks();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!title.trim() || loading) return;

    setLoading(true);
    const success = await quickAddTask(title, priority);
    setLoading(false);

    if (success) {
      setTitle('');
    }
  };

  const priorityColors = {
    low: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30',
    medium: 'text-amber-400 bg-amber-950/60 border-amber-500/30',
    high: 'text-rose-400 bg-rose-950/60 border-rose-500/30',
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative glass-panel rounded-2xl p-2.5 sm:p-3 border transition-all duration-300 mb-6 ${
        isFocused
          ? 'border-teal-500/60 bg-slate-900/90 shadow-lg shadow-teal-500/10'
          : 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700'
      }`}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Lightning Icon */}
        <div className="p-2 rounded-xl bg-gradient-to-tr from-teal-500/20 to-emerald-500/20 border border-teal-500/30 text-teal-400 shrink-0">
          <Zap className="w-4 h-4" />
        </div>

        {/* Input */}
        <input
          type="text"
          placeholder="Quick add: Type task title and press Enter... (e.g. Test auth API)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full bg-transparent border-none text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-0"
        />

        {/* Priority Quick Picker */}
        <div className="flex items-center gap-1 shrink-0">
          {(['low', 'medium', 'high']).map((p) => {
            const isSelected = priority === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`text-[10px] uppercase font-bold px-2 py-1 rounded-lg border transition-all ${
                  isSelected
                    ? priorityColors[p] + ' scale-105 shadow-sm'
                    : 'text-slate-500 border-transparent hover:text-slate-300'
                }`}
                title={`Priority: ${p}`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!title.trim() || loading}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all disabled:opacity-30 disabled:pointer-events-none hover:scale-105 shrink-0"
        >
          <span>Add</span>
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
  );
};

export default QuickTaskInput;
