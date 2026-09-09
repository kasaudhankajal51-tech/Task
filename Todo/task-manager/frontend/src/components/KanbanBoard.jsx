import React from 'react';
import { Clock, CheckCircle2, Circle, ArrowRight, ArrowLeft, Plus, Edit2, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const KanbanBoard = () => {
  const { tasks, updateTaskStatus, openEditModal, openDeleteModal, openCreateModal } = useTasks();

  const columns = [
    {
      id: 'pending',
      title: 'To Do / Pending',
      icon: <Circle className="w-4 h-4 text-slate-400" />,
      headerBorder: 'border-slate-700/80',
      badgeBg: 'bg-slate-800 text-slate-300',
      tasks: tasks.filter((t) => (t.status === 'pending' || !t.status) && !t.completed),
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      icon: <Clock className="w-4 h-4 text-amber-400" />,
      headerBorder: 'border-amber-500/40',
      badgeBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      tasks: tasks.filter((t) => t.status === 'in-progress' && !t.completed),
    },
    {
      id: 'completed',
      title: 'Completed',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      headerBorder: 'border-emerald-500/40',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      tasks: tasks.filter((t) => t.status === 'completed' || t.completed),
    },
  ];

  const priorityBadges = {
    high: 'text-rose-400 bg-rose-950/60 border-rose-500/30',
    medium: 'text-amber-400 bg-amber-950/60 border-amber-500/30',
    low: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
      {columns.map((col) => (
        <div
          key={col.id}
          className="glass-panel rounded-2xl border border-slate-800/90 flex flex-col min-h-[480px] bg-slate-900/40 p-4"
        >
          {/* Column Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              {col.icon}
              <h3 className="text-sm font-bold text-slate-200">{col.title}</h3>
            </div>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${col.badgeBg}`}>
              {col.tasks.length}
            </span>
          </div>

          {/* Column Tasks */}
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[620px] pr-1">
            {col.tasks.length === 0 ? (
              <div className="h-32 rounded-xl border border-dashed border-slate-800 flex flex-col items-center justify-center text-xs text-slate-500">
                <span>No tasks in this column</span>
              </div>
            ) : (
              col.tasks.map((task) => {
                const isOverdue =
                  task.dueDate &&
                  !task.completed &&
                  task.status !== 'completed' &&
                  new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

                return (
                  <div
                    key={task._id}
                    className="glass-card p-4 rounded-xl border border-slate-800/80 bg-slate-900/80 hover:border-teal-500/40 transition-all space-y-3"
                  >
                    {/* Top Row: Title & Actions */}
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        className={`text-sm font-semibold leading-snug ${
                          task.completed || task.status === 'completed'
                            ? 'line-through text-slate-500'
                            : 'text-slate-100'
                        }`}
                      >
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => openEditModal(task)}
                          className="p-1 rounded text-slate-400 hover:text-teal-300 hover:bg-slate-800"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(task._id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-950/40"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    {task.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    {/* Badges Row */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-[11px]">
                      <span
                        className={`px-2 py-0.5 rounded-full border font-semibold capitalize ${
                          priorityBadges[task.priority] || priorityBadges.medium
                        }`}
                      >
                        {task.priority}
                      </span>

                      {task.dueDate && (
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${
                            isOverdue
                              ? 'text-rose-400 bg-rose-950/40 font-semibold'
                              : 'text-slate-400 bg-slate-800/40'
                          }`}
                        >
                          <Calendar className="w-3 h-3" />
                          {task.dueDate.split('T')[0]}
                        </span>
                      )}
                    </div>

                    {/* Quick Shift Buttons */}
                    <div className="flex items-center justify-between pt-1 gap-1">
                      {col.id !== 'pending' && (
                        <button
                          onClick={() =>
                            updateTaskStatus(
                              task._id,
                              col.id === 'completed' ? 'in-progress' : 'pending'
                            )
                          }
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800/50 hover:bg-slate-800 transition-colors"
                        >
                          <ArrowLeft className="w-3 h-3" />
                          <span>{col.id === 'completed' ? 'In Progress' : 'To Do'}</span>
                        </button>
                      )}

                      <div className="flex-1" />

                      {col.id !== 'completed' && (
                        <button
                          onClick={() =>
                            updateTaskStatus(
                              task._id,
                              col.id === 'pending' ? 'in-progress' : 'completed'
                            )
                          }
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-300 hover:text-white px-2 py-1 rounded bg-teal-950/40 hover:bg-teal-900/60 border border-teal-500/20 transition-colors"
                        >
                          <span>{col.id === 'pending' ? 'Start' : 'Complete'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Add at Bottom of Column */}
          <button
            onClick={openCreateModal}
            className="mt-3 w-full py-2 rounded-xl border border-dashed border-slate-800 hover:border-teal-500/40 hover:bg-slate-800/40 text-xs font-semibold text-slate-400 hover:text-teal-300 flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
