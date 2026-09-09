import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useTasks } from '../context/TaskContext';

export const TaskItem = ({ task }) => {
  const { toggleTaskComplete, openEditModal, openDeleteModal } = useTasks();

  const isCompleted = task.completed || task.status === 'completed';
  const priorityConf = colors.priority[task.priority] || colors.priority.medium;
  const categoryConf = colors.categories[task.category] || colors.categories.Personal;

  // Relative Due Date Calculator
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
    return {
      text: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  };

  const dueInfo = getDueInfo();

  return (
    <View style={[styles.card, isCompleted && styles.cardCompleted]}>
      {/* Category Ribbon & Badges Header */}
      <View style={styles.cardHeader}>
        <View style={styles.headerBadges}>
          {/* Category Chip */}
          <View
            style={[
              styles.categoryChip,
              {
                backgroundColor: categoryConf.bg,
                borderColor: categoryConf.border,
              },
            ]}
          >
            <Feather name={categoryConf.icon} size={10} color={categoryConf.color} />
            <Text style={[styles.categoryText, { color: categoryConf.color }]}>
              {task.category || 'Personal'}
            </Text>
          </View>

          {/* Priority Chip */}
          <View
            style={[
              styles.priorityChip,
              {
                backgroundColor: priorityConf.bg,
                borderColor: priorityConf.border,
              },
            ]}
          >
            <View
              style={[styles.priorityDot, { backgroundColor: priorityConf.dot }]}
            />
            <Text style={[styles.priorityText, { color: priorityConf.text }]}>
              {task.priority?.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Due Date Badge */}
        {dueInfo ? (
          <View
            style={[
              styles.dueBadge,
              dueInfo.isOverdue && !isCompleted && styles.dueBadgeOverdue,
              dueInfo.isToday && !isCompleted && styles.dueBadgeToday,
            ]}
          >
            <Feather
              name={dueInfo.isOverdue && !isCompleted ? 'alert-circle' : 'clock'}
              size={11}
              color={
                dueInfo.isOverdue && !isCompleted
                  ? colors.rose
                  : dueInfo.isToday && !isCompleted
                  ? colors.amber
                  : colors.textSecondary
              }
            />
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

      {/* Main Task Row: Checkbox, Title & Description, Action Icons */}
      <View style={styles.mainRow}>
        <TouchableOpacity
          style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}
          onPress={() => toggleTaskComplete(task)}
          activeOpacity={0.7}
        >
          {isCompleted && (
            <Feather name="check" size={13} color="#090d16" strokeWidth={3.5} />
          )}
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

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => openEditModal(task)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="edit-2" size={14} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={() => openDeleteModal(task._id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="trash-2" size={14} color={colors.rose} />
          </TouchableOpacity>
        </View>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  cardCompleted: {
    opacity: 0.6,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 8,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
  },
  priorityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 8,
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
  dueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
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
  mainRow: {
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
    gap: 6,
  },
  actionBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  deleteBtn: {
    borderColor: 'rgba(244, 63, 94, 0.2)',
  },
});

export default TaskItem;
