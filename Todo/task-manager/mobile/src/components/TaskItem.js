import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useTasks } from '../context/TaskContext';

export const TaskItem = ({ task }) => {
  const { toggleTaskComplete, openEditModal, openDeleteModal } = useTasks();

  const isCompleted = task.completed || task.status === 'completed';

  const priorityConf = colors.priority[task.priority] || colors.priority.medium;

  // Relative Date Calculator
  const getDueInfo = () => {
    if (!task.dueDate) return null;
    const due = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Overdue (${Math.abs(diffDays)}d)`, isOverdue: true };
    }
    if (diffDays === 0) {
      return { text: 'Due Today', isToday: true };
    }
    if (diffDays === 1) {
      return { text: 'Tomorrow', isUpcoming: true };
    }
    return { text: `${due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` };
  };

  const dueInfo = getDueInfo();

  return (
    <View style={[styles.card, isCompleted && styles.cardCompleted]}>
      {/* Top row: Checkbox, Title, Actions */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}
          onPress={() => toggleTaskComplete(task)}
          activeOpacity={0.7}
        >
          {isCompleted && <Feather name="check" size={12} color="#090d16" strokeWidth={3} />}
        </TouchableOpacity>

        <View style={styles.contentWrap}>
          <Text
            style={[styles.title, isCompleted && styles.titleCompleted]}
            numberOfLines={2}
          >
            {task.title}
          </Text>
          {task.description ? (
            <Text
              style={[styles.description, isCompleted && styles.descriptionCompleted]}
              numberOfLines={2}
            >
              {task.description}
            </Text>
          ) : null}
        </View>

        {/* Edit & Delete actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => openEditModal(task)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="edit-2" size={14} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => openDeleteModal(task._id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="trash-2" size={14} color={colors.rose} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer: Priority & Due Date */}
      <View style={styles.footer}>
        <View style={styles.badgeRow}>
          {/* Priority Chip */}
          <View
            style={[
              styles.priorityChip,
              { backgroundColor: priorityConf.bg, borderColor: priorityConf.border },
            ]}
          >
            <View style={[styles.priorityDot, { backgroundColor: priorityConf.dot }]} />
            <Text style={[styles.priorityText, { color: priorityConf.text }]}>
              {task.priority?.toUpperCase()}
            </Text>
          </View>

          {/* Status Chip */}
          <View
            style={[
              styles.statusChip,
              {
                backgroundColor:
                  task.status === 'completed'
                    ? 'rgba(16, 185, 129, 0.12)'
                    : task.status === 'in-progress'
                    ? 'rgba(14, 165, 233, 0.12)'
                    : 'rgba(148, 163, 184, 0.1)',
              },
            ]}
          >
            <Text style={styles.statusText}>
              {task.status ? task.status.replace('-', ' ') : 'pending'}
            </Text>
          </View>
        </View>

        {/* Due Date */}
        {dueInfo ? (
          <View
            style={[
              styles.dueBadge,
              dueInfo.isOverdue && !isCompleted && styles.dueBadgeOverdue,
              dueInfo.isToday && !isCompleted && styles.dueBadgeToday,
            ]}
          >
            {dueInfo.isOverdue && !isCompleted ? (
              <Feather name="alert-circle" size={11} color={colors.rose} />
            ) : (
              <Feather name="clock" size={11} color={colors.textSecondary} />
            )}
            <Text
              style={[
                styles.dueText,
                dueInfo.isOverdue && !isCompleted && styles.dueTextOverdue,
                dueInfo.isToday && !isCompleted && styles.dueTextToday,
              ]}
            >
              {dueInfo.text}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
  },
  cardCompleted: {
    opacity: 0.65,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceLight,
    marginTop: 2,
  },
  checkboxCompleted: {
    backgroundColor: colors.teal,
    borderColor: colors.teal,
  },
  contentWrap: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 19,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  description: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
    lineHeight: 16,
  },
  descriptionCompleted: {
    color: colors.textDisabled,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 4,
  },
  actionBtn: {
    padding: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priorityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
  },
  priorityDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  priorityText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  dueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: colors.surfaceLight,
  },
  dueBadgeOverdue: {
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.3)',
  },
  dueBadgeToday: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  dueText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  dueTextOverdue: {
    color: colors.rose,
    fontWeight: '700',
  },
  dueTextToday: {
    color: colors.amber,
    fontWeight: '700',
  },
});

export default TaskItem;
