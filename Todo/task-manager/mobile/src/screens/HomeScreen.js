import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useTasks } from '../context/TaskContext';
import Header from '../components/Header';
import MetricsCard from '../components/MetricsCard';
import FilterPills from '../components/FilterPills';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';
import DeleteModal from '../components/DeleteModal';
import ServerConfigModal from '../components/ServerConfigModal';
import ProfileModal from '../components/ProfileModal';

export const HomeScreen = () => {
  const {
    tasks,
    loading,
    refreshing,
    fetchTasks,
    openCreateModal,
    filters,
    isProfileModalOpen,
    closeProfileModal,
  } = useTasks();

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.teal} />
          <Text style={styles.loadingText}>Syncing your personal tasks...</Text>
        </View>
      );
    }

    if (
      tasks.length === 0 &&
      (filters.search ||
        filters.status !== 'all' ||
        filters.priority !== 'all' ||
        filters.category !== 'all')
    ) {
      return (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconWrap}>
            <Feather name="search" size={28} color={colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>No matching tasks</Text>
          <Text style={styles.emptySubtitle}>
            Try changing your search keywords or filter pills.
          </Text>
        </View>
      );
    }

    if (tasks.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconWrap, styles.emptyIconWrapSuccess]}>
            <Feather name="check-circle" size={32} color={colors.teal} />
          </View>
          <Text style={styles.emptyTitle}>Your Workspace is Clear!</Text>
          <Text style={styles.emptySubtitle}>
            No tasks in your personal list. Tap the "+" button below to add your first task.
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <Header />

      {/* Main Task List */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <TaskItem task={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchTasks(true)}
            tintColor={colors.teal}
            colors={[colors.teal]}
          />
        }
        ListHeaderComponent={
          <>
            <MetricsCard />
            <FilterPills />
          </>
        }
        ListEmptyComponent={renderEmptyState}
      />

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={openCreateModal}
        activeOpacity={0.85}
      >
        <Feather name="plus" size={28} color="#090d16" strokeWidth={3} />
      </TouchableOpacity>

      {/* Modals */}
      <TaskModal />
      <DeleteModal />
      <ServerConfigModal />
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 100,
    paddingHorizontal: 16,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyIconWrapSuccess: {
    backgroundColor: 'rgba(20, 184, 166, 0.12)',
    borderColor: 'rgba(20, 184, 166, 0.3)',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    maxWidth: 320,
  },
  loadingText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.teal,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  },
});

export default HomeScreen;
