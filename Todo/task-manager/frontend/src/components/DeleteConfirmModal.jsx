import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const DeleteConfirmModal = () => {
  const { isDeleteModalOpen, deletingTaskId, closeDeleteModal, removeTask } = useTasks();

  if (!isDeleteModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md glass-panel bg-slate-900/95 border border-rose-500/20 rounded-3xl p-6 shadow-2xl shadow-rose-950/20 animate-slide-up relative text-center">
        
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-7 h-7" />
        </div>

        {/* Text */}
        <h3 className="text-lg font-bold text-white tracking-tight">Delete this task?</h3>
        <p className="text-sm text-slate-400 mt-2">
          Are you sure you want to remove this task? This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={closeDeleteModal}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-sm font-semibold text-slate-300 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => removeTask(deletingTaskId)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white text-sm font-semibold shadow-lg shadow-rose-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
