import React from 'react';
import { Command, X, Keyboard } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const KeyboardShortcutsModal = () => {
  const { isShortcutsOpen, closeShortcutsModal } = useTasks();

  if (!isShortcutsOpen) return null;

  const shortcuts = [
    { key: 'N', action: 'Open Create Task modal' },
    { key: '/', action: 'Focus search bar' },
    { key: '1', action: 'Switch to Grid View' },
    { key: '2', action: 'Switch to Kanban Board View' },
    { key: '3', action: 'Switch to Table View' },
    { key: 'E', action: 'Export tasks as JSON' },
    { key: '?', action: 'Open / Close shortcuts guide' },
    { key: 'Esc', action: 'Close any active modal' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md glass-panel bg-slate-900/95 border border-slate-700/80 rounded-3xl p-6 shadow-2xl animate-slide-up relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Keyboard Shortcuts</h3>
              <p className="text-xs text-slate-400">Boost your productivity</p>
            </div>
          </div>
          <button
            onClick={closeShortcutsModal}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-2 max-h-[350px] overflow-y-auto">
          {shortcuts.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-950/50 border border-slate-800/80"
            >
              <span className="text-xs text-slate-300 font-medium">{item.action}</span>
              <kbd className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-800 text-teal-300 rounded-lg border border-slate-700 shadow-inner">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            Press <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px]">Esc</kbd> anytime to dismiss
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;
