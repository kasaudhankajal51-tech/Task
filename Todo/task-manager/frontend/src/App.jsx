import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider, useTasks } from './context/TaskContext';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import QuickTaskInput from './components/QuickTaskInput';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import { Sparkles, Calendar as CalendarIcon, ShieldCheck } from 'lucide-react';

const DashboardContent = () => {
  const {
    openCreateModal,
    closeModal,
    closeDeleteModal,
    openShortcutsModal,
    closeShortcutsModal,
    setViewMode,
    isModalOpen,
    isDeleteModalOpen,
    isShortcutsOpen,
  } = useTasks();

  const { user, isAuthenticated, openAuthModal } = useAuth();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInputActive =
        document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'TEXTAREA' ||
        document.activeElement.tagName === 'SELECT';

      // Escape closes any open modal
      if (e.key === 'Escape') {
        if (isModalOpen) closeModal();
        if (isDeleteModalOpen) closeDeleteModal();
        if (isShortcutsOpen) closeShortcutsModal();
        return;
      }

      // If typing in an input, don't trigger hotkeys
      if (isInputActive) return;

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        openCreateModal();
      } else if (e.key === '1') {
        e.preventDefault();
        setViewMode('grid');
      } else if (e.key === '2') {
        e.preventDefault();
        setViewMode('kanban');
      } else if (e.key === '3') {
        e.preventDefault();
        setViewMode('list');
      } else if (e.key === '?') {
        e.preventDefault();
        if (isShortcutsOpen) closeShortcutsModal();
        else openShortcutsModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    openCreateModal,
    closeModal,
    closeDeleteModal,
    openShortcutsModal,
    closeShortcutsModal,
    setViewMode,
    isModalOpen,
    isDeleteModalOpen,
    isShortcutsOpen,
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-x-hidden">
      {/* Ambient background glow accents */}
      <div
        className="gradient-glow w-[550px] h-[550px] bg-teal-500/10 top-[-100px] left-[-100px]"
        aria-hidden="true"
      />
      <div
        className="gradient-glow w-[550px] h-[550px] bg-emerald-500/10 bottom-[10%] right-[-150px]"
        aria-hidden="true"
      />
      <div
        className="gradient-glow w-[400px] h-[400px] bg-cyan-500/5 top-[35%] left-[25%]"
        aria-hidden="true"
      />

      {/* Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Unauthenticated Alert Banner */}
        {!isAuthenticated && (
          <div className="mb-6 p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Private Multi-User Mode Active</h3>
                <p className="text-xs text-slate-400">Sign in to sync and isolate your personal tasks across phone and web.</p>
              </div>
            </div>
            <button
              onClick={openAuthModal}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-extrabold shadow-md transition-all self-start sm:self-auto"
            >
              Sign In / Create Account
            </button>
          </div>
        )}

        {/* Welcome & Live Date Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                <span>{isAuthenticated ? `Welcome back, ${user?.name?.split(' ')[0]}` : 'TaskFlow Workspace'}</span>
                <Sparkles className="w-5 h-5 text-teal-400 shrink-0" />
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              High-performance task management with real-time MongoDB Atlas sync
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl glass-panel text-xs font-semibold text-slate-300 self-start sm:self-auto border border-slate-800/90 shadow-md">
            <CalendarIcon className="w-4 h-4 text-teal-400" />
            <span>{today}</span>
          </div>
        </div>

        {/* Real-time Dashboard Metrics & Circular Progress */}
        <StatsOverview />

        {/* Lightning Fast Inline Quick Add Bar */}
        <QuickTaskInput />

        {/* Search, Filter & Sort Controls */}
        <FilterBar />

        {/* Dynamic Task View (Grid / Kanban / Table) */}
        <TaskList />
      </main>

      {/* Modals & Popups */}
      <TaskModal />
      <DeleteConfirmModal />
      <KeyboardShortcutsModal />
      <AuthModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <DashboardContent />
      </TaskProvider>
    </AuthProvider>
  );
}
