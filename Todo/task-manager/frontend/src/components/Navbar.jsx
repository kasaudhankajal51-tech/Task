import React, { useState } from 'react';
import {
  Plus,
  CheckSquare,
  Server,
  LayoutGrid,
  Columns3,
  List,
  Download,
  HelpCircle,
  Palette,
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const Navbar = () => {
  const {
    openCreateModal,
    backendConnected,
    viewMode,
    setViewMode,
    exportTasks,
    openShortcutsModal,
    accentTheme,
    setAccentTheme,
  } = useTasks();

  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 via-emerald-400 to-cyan-400 p-0.5 shadow-lg shadow-teal-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-teal-300 bg-clip-text text-transparent">
                TaskFlow
              </span>
              <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Fullstack Task Management System</p>
          </div>
        </div>

        {/* Center: View Switcher (Grid / Kanban / List) */}
        <div className="hidden md:flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner">
          <button
            onClick={() => setViewMode('grid')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'grid'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Grid View (1)"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>

          <button
            onClick={() => setViewMode('kanban')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'kanban'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Kanban Board (2)"
          >
            <Columns3 className="w-3.5 h-3.5" />
            <span>Kanban</span>
          </button>

          <button
            onClick={() => setViewMode('list')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'list'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Table List View (3)"
          >
            <List className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800 transition-colors"
              title="Export Tasks"
            >
              <Download className="w-4 h-4" />
            </button>

            {showExportMenu && (
              <div
                className="absolute right-0 mt-2 w-40 glass-panel bg-slate-900/95 border border-slate-700/80 rounded-2xl p-1.5 shadow-xl z-50 animate-slide-up"
                onMouseLeave={() => setShowExportMenu(false)}
              >
                <button
                  onClick={() => {
                    exportTasks('json');
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-teal-500/20 rounded-xl transition-colors"
                >
                  Export as JSON (.json)
                </button>
                <button
                  onClick={() => {
                    exportTasks('csv');
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-teal-500/20 rounded-xl transition-colors"
                >
                  Export as CSV (.csv)
                </button>
              </div>
            )}
          </div>

          {/* Keyboard Shortcuts Helper */}
          <button
            onClick={openShortcutsModal}
            className="hidden sm:inline-flex p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800 transition-colors"
            title="Keyboard Shortcuts (?)"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Backend Status Pill */}
          <div
            className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
              backendConnected
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/20'
                : 'bg-rose-950/40 text-rose-300 border-rose-500/20'
            }`}
            title={backendConnected ? 'Backend Connected' : 'Cannot connect to backend on :5000'}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                backendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
              }`}
            />
            <Server className="w-3.5 h-3.5 opacity-70" />
            <span>{backendConnected ? 'Atlas Live' : 'Offline'}</span>
          </div>

          {/* Add New Task Button */}
          <button
            onClick={openCreateModal}
            className="group relative inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 shadow-lg shadow-teal-500/25 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200 stroke-[2.5]" />
            <span>New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
