import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const Toast = () => {
  const { toast } = useTasks();

  if (!toast.show) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-teal-400 shrink-0" />,
  };

  const borderStyles = {
    success: 'border-emerald-500/30 bg-emerald-950/80 text-emerald-100 shadow-emerald-950/50',
    error: 'border-rose-500/30 bg-rose-950/80 text-rose-100 shadow-rose-950/50',
    info: 'border-teal-500/30 bg-teal-950/80 text-teal-100 shadow-teal-950/50',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-xl text-sm font-medium transition-all ${
          borderStyles[toast.type] || borderStyles.info
        }`}
      >
        {icons[toast.type] || icons.info}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

export default Toast;
