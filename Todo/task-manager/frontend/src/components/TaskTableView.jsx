import React from 'react';
import { Check, Calendar, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const TaskTableView = () => {
  const { tasks, toggleTaskComplete, openEditModal, openDeleteModal } = useTasks();

  const priorityBadges = {
    high: 'text-rose-400 bg-rose-950/60 border-rose-500/30',
    medium: 'text-amber-400 bg-amber-950/60 border-amber-500/30',
    low: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30',
  };

  const statusBadges = {
    completed: 'text-emerald-300 bg-emerald-950/60 border-emerald-500/30',
    'in-progress': 'text-sky-300 bg-sky-950/60 border-sky-500/30',
    pending: 'text-slate-400 bg-slate-800/80 border-slate-700/60',
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/90 text-xs uppercase text-slate-400 font-semibold tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4 w-12 text-center">Done</th>
              <th className="py-3.5 px-4">Task Details</th>
              <th className="py-3.5 px-4 w-28">Priority</th>
              <th className="py-3.5 px-4 w-32">Status</th>
              <th className="py-3.5 px-4 w-36">Due Date</th>
              <th className="py-3.5 px-4 w-24 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {tasks.map((task) => {
              const isCompleted = task.completed || task.status === 'completed';
              const isOverdue =
                task.dueDate &&
                !isCompleted &&
                new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

              return (
                <tr
                  key={task._id}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    isCompleted ? 'bg-slate-950/40 opacity-70' : 'bg-transparent'
                  }`}
                >
                  {/* Done Checkbox */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleTaskComplete(task)}
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-teal-500 border-teal-500 text-slate-950'
                          : 'border-slate-700 hover:border-teal-400 bg-slate-950/60'
                      }`}
                    >
                      {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                  </td>

                  {/* Title & Description */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-100 flex items-center gap-2">
                      <span className={isCompleted ? 'line-through text-slate-500' : ''}>
                        {task.title}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {task.description}
                      </p>
                    )}
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full border capitalize ${
                        priorityBadges[task.priority] || priorityBadges.medium
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full border capitalize ${
                        statusBadges[task.status] || statusBadges.pending
                      }`}
                    >
                      {task.status?.replace('-', ' ')}
                    </span>
                  </td>

                  {/* Due Date */}
                  <td className="py-3 px-4 text-xs">
                    {task.dueDate ? (
                      <div
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded ${
                          isOverdue
                            ? 'text-rose-400 bg-rose-950/40 font-semibold'
                            : 'text-slate-400'
                        }`}
                      >
                        {isOverdue ? (
                          <AlertCircle className="w-3 h-3 text-rose-400" />
                        ) : (
                          <Calendar className="w-3 h-3 opacity-60" />
                        )}
                        <span>{task.dueDate.split('T')[0]}</span>
                      </div>
                    ) : (
                      <span className="text-slate-600 text-xs">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(task)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-teal-300 hover:bg-slate-800 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(task._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTableView;
