import React from 'react';
import { Calendar, Check, Edit2, Trash2, AlertCircle, Copy, Clock, ArrowRight } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const TaskCard = ({ task }) => {
  const { toggleTaskComplete, updateTaskStatus, openEditModal, openDeleteModal, showToast } = useTasks();

  const isCompleted = task.completed || task.status === 'completed';

  // Priority Styles & Dots
  const priorityConfig = {
    high: {
      label: 'High Priority',
      badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      dot: 'bg-rose-500 shadow-sm shadow-rose-500',
    },
    medium: {
      label: 'Medium',
      badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      dot: 'bg-amber-500 shadow-sm shadow-amber-500',
    },
    low: {
      label: 'Low Priority',
      badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      dot: 'bg-emerald-500 shadow-sm shadow-emerald-500',
    },
  };

  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  // Status Styles
  const statusConfig = {
    completed: { label: 'Completed', style: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30' },
    'in-progress': { label: 'In Progress', style: 'bg-sky-950/60 text-sky-300 border-sky-500/30' },
    pending: { label: 'To Do', style: 'bg-slate-800/80 text-slate-400 border-slate-700/60' },
  };

  const status = statusConfig[task.status] || statusConfig.pending;

  // Humanize relative date
  const getRelativeDateInfo = (dateString) => {
    if (!dateString) return null;
    const taskDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    taskDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((taskDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: `Overdue by ${Math.abs(diffDays)}d`,
        isOverdue: true,
        formatted: taskDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      };
    }
    if (diffDays === 0) {
      return { text: 'Due Today', isOverdue: false, isToday: true };
    }
    if (diffDays === 1) {
      return { text: 'Due Tomorrow', isOverdue: false };
    }
    return {
      text: `Due in ${diffDays}d`,
      isOverdue: false,
      formatted: taskDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  };

  const dateInfo = getRelativeDateInfo(task.dueDate);

  const copyTaskTitle = () => {
    navigator.clipboard.writeText(task.title);
    showToast('Task title copied to clipboard! 📋', 'info');
  };

  return (
    <div
      className={`glass-card group relative p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
        isCompleted
          ? 'border-slate-800/40 opacity-75 bg-slate-950/40'
          : 'border-slate-800/90 bg-slate-900/60'
      }`}
    >
      <div>
        {/* Header: Checkbox + Title + Actions */}
        <div className="flex items-start gap-3 justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Custom Interactive Checkbox */}
            <button
              onClick={() => toggleTaskComplete(task)}
              aria-label={isCompleted ? 'Mark task as incomplete' : 'Mark task as complete'}
              className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all duration-200 shrink-0 ${
                isCompleted
                  ? 'bg-teal-500 border-teal-500 text-slate-950 shadow-md shadow-teal-500/30 scale-105'
                  : 'border-slate-700 hover:border-teal-400/80 bg-slate-950/60'
              }`}
            >
              {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>

            {/* Title & Description */}
            <div className="min-w-0 flex-1">
              <h3
                className={`text-sm sm:text-base font-bold tracking-tight transition-all duration-200 leading-snug ${
                  isCompleted
                    ? 'line-through text-slate-500'
                    : 'text-slate-100 group-hover:text-teal-300'
                }`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p
                  className={`text-xs mt-1.5 leading-relaxed line-clamp-2 ${
                    isCompleted ? 'text-slate-600' : 'text-slate-400'
                  }`}
                >
                  {task.description}
                </p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={copyTaskTitle}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Copy Title"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => openEditModal(task)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-teal-300 hover:bg-slate-800 transition-colors"
              title="Edit Task"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => openDeleteModal(task._id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer: Priority, Status, Due Date */}
      <div className="mt-4 pt-3.5 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Priority Pill */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold border text-[10px] uppercase tracking-wider ${priority.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
            {priority.label}
          </span>

          {/* Status Switcher Button */}
          <button
            onClick={() => {
              const nextStatus =
                task.status === 'pending'
                  ? 'in-progress'
                  : task.status === 'in-progress'
                  ? 'completed'
                  : 'pending';
              updateTaskStatus(task._id, nextStatus);
            }}
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold border text-[11px] hover:scale-105 transition-all ${status.style}`}
            title="Click to cycle status"
          >
            <span>{status.label}</span>
          </button>
        </div>

        {/* Due Date Indicator with Relative Text */}
        {dateInfo && (
          <div
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${
              dateInfo.isOverdue && !isCompleted
                ? 'text-rose-400 bg-rose-950/50 border border-rose-500/40'
                : dateInfo.isToday && !isCompleted
                ? 'text-amber-300 bg-amber-950/40 border border-amber-500/30'
                : 'text-slate-400 bg-slate-800/50'
            }`}
          >
            {dateInfo.isOverdue && !isCompleted ? (
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Clock className="w-3 h-3 opacity-70" />
            )}
            <span>{dateInfo.text}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
