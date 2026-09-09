import React from 'react';
import { Plus, CheckCircle, SearchX, LayoutGrid, Columns3, List } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import TaskCard from './TaskCard';
import KanbanBoard from './KanbanBoard';
import TaskTableView from './TaskTableView';

export const TaskList = () => {
  const { tasks, loading, openCreateModal, filters, viewMode, setViewMode } = useTasks();

  // Loading Skeleton State (for Grid View)
  if (loading && tasks.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="glass-panel p-5 rounded-2xl border border-slate-800/80 animate-pulse space-y-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-lg bg-slate-800" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-800/60 rounded w-5/6" />
              </div>
            </div>
            <div className="flex justify-between pt-3 border-t border-slate-800/50">
              <div className="h-4 bg-slate-800 rounded w-20" />
              <div className="h-4 bg-slate-800 rounded w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty Search / Filter Results
  if (tasks.length === 0 && (filters.search || filters.status !== 'all' || filters.priority !== 'all')) {
    return (
      <div className="glass-panel p-12 rounded-3xl border border-slate-800/80 text-center flex flex-col items-center justify-center my-8">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-slate-400">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-200">No matching tasks found</h3>
        <p className="text-sm text-slate-400 max-w-sm mt-1 mb-6">
          We couldn't find any tasks matching your active search query or filters.
        </p>
      </div>
    );
  }

  // Empty State (No tasks at all)
  if (tasks.length === 0) {
    return (
      <div className="glass-panel p-12 sm:p-16 rounded-3xl border border-dashed border-slate-800 text-center flex flex-col items-center justify-center my-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500/20 to-emerald-500/20 border border-teal-500/30 flex items-center justify-center mb-4 text-teal-400">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-100">You're all caught up!</h3>
        <p className="text-sm text-slate-400 max-w-md mt-2 mb-6">
          No tasks found in your workspace. Create your first task now to start organizing your day.
        </p>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add Your First Task</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View Switcher bar (Visible on Mobile / Small screens) */}
      <div className="flex md:hidden items-center justify-between gap-2 px-1 text-xs">
        <span className="text-slate-400">
          <strong className="text-slate-200">{tasks.length}</strong> tasks
        </span>
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`p-1.5 rounded-lg ${viewMode === 'kanban' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400'}`}
          >
            <Columns3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Render Dynamic View */}
      {viewMode === 'kanban' ? (
        <KanbanBoard />
      ) : viewMode === 'list' ? (
        <TaskTableView />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
