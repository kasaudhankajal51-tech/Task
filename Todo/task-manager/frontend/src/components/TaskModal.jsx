import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle, Loader2, Calendar } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const TaskModal = () => {
  const { isModalOpen, editingTask, closeModal, addTask, editTask } = useTasks();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || '',
        description: editingTask.description || '',
        status: editingTask.status || 'pending',
        priority: editingTask.priority || 'medium',
        dueDate: editingTask.dueDate ? editingTask.dueDate.split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: '',
      });
    }
    setError('');
  }, [editingTask, isModalOpen]);

  if (!isModalOpen) return null;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!formData.title.trim()) {
      setError('Please provide a task title');
      return;
    }

    setSubmitting(true);
    setError('');

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      priority: formData.priority,
      dueDate: formData.dueDate || null,
      completed: formData.status === 'completed',
    };

    let result;
    if (editingTask) {
      result = await editTask(editingTask._id, payload);
    } else {
      result = await addTask(payload);
    }

    setSubmitting(false);

    if (result && result.success) {
      closeModal();
    } else if (result && result.error) {
      setError(result.error);
    }
  };

  // Quick Date Helpers
  const setQuickDate = (daysFromNow) => {
    const target = new Date();
    target.setDate(target.getDate() + daysFromNow);
    setFormData((prev) => ({
      ...prev,
      dueDate: target.toISOString().split('T')[0],
    }));
  };

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/40' },
    { value: 'medium', label: 'Medium', color: 'border-amber-500/30 text-amber-400 bg-amber-950/40' },
    { value: 'high', label: 'High', color: 'border-rose-500/30 text-rose-400 bg-rose-950/40' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-lg glass-panel bg-slate-900/95 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 animate-slide-up relative"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {editingTask ? 'Edit Task Details' : 'Create New Task'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {editingTask ? 'Update task metadata and state' : 'Add a task to your workspace workflow'}
            </p>
          </div>
          <button
            onClick={closeModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {/* Title Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Task Title <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {formData.title.length}/100
              </span>
            </div>
            <input
              type="text"
              required
              maxLength={100}
              placeholder="e.g. Connect MongoDB Atlas to React Native app"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
            />
          </div>

          {/* Description Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Add extra context, links, sub-items, or notes..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all resize-none"
            />
          </div>

          {/* Priority Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {priorityOptions.map((opt) => {
                const isSelected = formData.priority === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: opt.value })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize transition-all ${
                      isSelected
                        ? `${opt.color} ring-2 ring-teal-500/40 shadow-sm`
                        : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status and Due Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all cursor-pointer"
              >
                <option value="pending" className="bg-slate-900">To Do / Pending</option>
                <option value="in-progress" className="bg-slate-900">In Progress</option>
                <option value="completed" className="bg-slate-900">Completed</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
              />
            </div>
          </div>

          {/* Quick Date Chips */}
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Presets:</span>
            <button
              type="button"
              onClick={() => setQuickDate(0)}
              className="px-2 py-0.5 rounded-lg bg-slate-800 text-[10px] text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setQuickDate(1)}
              className="px-2 py-0.5 rounded-lg bg-slate-800 text-[10px] text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => setQuickDate(7)}
              className="px-2 py-0.5 rounded-lg bg-slate-800 text-[10px] text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              In 1 Week
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={closeModal}
              disabled={submitting}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-teal-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{editingTask ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
