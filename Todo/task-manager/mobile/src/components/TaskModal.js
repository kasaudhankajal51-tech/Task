import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useTasks } from '../context/TaskContext';

const CATEGORIES = ['Work', 'Personal', 'Urgent', 'Study', 'Finance', 'Health', 'Other'];
const PRIORITIES = ['low', 'medium', 'high'];
const STATUSES = [
  { id: 'pending', label: 'Pending' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
];

export const TaskModal = () => {
  const { isTaskModalOpen, closeTaskModal, editingTask, addTask, editTask } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('pending');
  const [dueDate, setDueDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setCategory(editingTask.category || 'Personal');
      setPriority(editingTask.priority || 'medium');
      setStatus(editingTask.status || (editingTask.completed ? 'completed' : 'pending'));
      setDueDate(
        editingTask.dueDate
          ? new Date(editingTask.dueDate).toISOString().split('T')[0]
          : ''
      );
    } else {
      setTitle('');
      setDescription('');
      setCategory('Personal');
      setPriority('medium');
      setStatus('pending');
      setDueDate('');
    }
    setError('');
  }, [editingTask, isTaskModalOpen]);

  const handleQuickDate = (type) => {
    const today = new Date();
    if (type === 'today') {
      setDueDate(today.toISOString().split('T')[0]);
    } else if (type === 'tomorrow') {
      today.setDate(today.getDate() + 1);
      setDueDate(today.toISOString().split('T')[0]);
    } else if (type === 'week') {
      today.setDate(today.getDate() + 7);
      setDueDate(today.toISOString().split('T')[0]);
    } else if (type === 'clear') {
      setDueDate('');
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    setSaving(true);
    setError('');

    const taskPayload = {
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status,
      completed: status === 'completed',
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    };

    let success = false;
    if (editingTask) {
      success = await editTask(editingTask._id, taskPayload);
    } else {
      success = await addTask(taskPayload);
    }

    setSaving(false);
    if (success) {
      closeTaskModal();
    }
  };

  if (!isTaskModalOpen) return null;

  return (
    <Modal
      visible={isTaskModalOpen}
      transparent
      animationType="slide"
      onRequestClose={closeTaskModal}
    >
      <TouchableWithoutFeedback onPress={closeTaskModal}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.sheet}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {/* Header */}
                <View style={styles.header}>
                  <View>
                    <Text style={styles.headerTitle}>
                      {editingTask ? 'Edit Task' : 'New Task'}
                    </Text>
                    <Text style={styles.headerSubtitle}>
                      {editingTask
                        ? 'Update your task parameters'
                        : 'Add a new item to your personal list'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={closeTaskModal}
                  >
                    <Feather name="x" size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                {error ? (
                  <View style={styles.errorBox}>
                    <Feather name="alert-circle" size={14} color={colors.rose} />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                {/* Form Fields */}
                <View style={styles.form}>
                  {/* Title */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>TITLE *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="What needs to be done?"
                      placeholderTextColor={colors.textDisabled}
                      value={title}
                      onChangeText={setTitle}
                      autoFocus={!editingTask}
                    />
                  </View>

                  {/* Description */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>DESCRIPTION / NOTES</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Add details, steps or context..."
                      placeholderTextColor={colors.textDisabled}
                      value={description}
                      onChangeText={setDescription}
                      multiline
                      numberOfLines={3}
                    />
                  </View>

                  {/* Category Chips */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>CATEGORY</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.chipsRow}
                    >
                      {CATEGORIES.map((cat) => {
                        const isSelected = category === cat;
                        const catConf = colors.categories[cat];

                        return (
                          <TouchableOpacity
                            key={cat}
                            style={[
                              styles.chip,
                              isSelected && {
                                backgroundColor: catConf.bg,
                                borderColor: catConf.color,
                              },
                            ]}
                            onPress={() => setCategory(cat)}
                            activeOpacity={0.7}
                          >
                            <Feather
                              name={catConf.icon}
                              size={12}
                              color={isSelected ? catConf.color : colors.textSecondary}
                            />
                            <Text
                              style={[
                                styles.chipText,
                                isSelected && { color: catConf.color, fontWeight: '800' },
                              ]}
                            >
                              {cat}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>

                  {/* Priority Selector */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>PRIORITY</Text>
                    <View style={styles.priorityGrid}>
                      {PRIORITIES.map((p) => {
                        const isSelected = priority === p;
                        const pConf = colors.priority[p];

                        return (
                          <TouchableOpacity
                            key={p}
                            style={[
                              styles.priorityBtn,
                              isSelected && {
                                backgroundColor: pConf.bg,
                                borderColor: pConf.border,
                              },
                            ]}
                            onPress={() => setPriority(p)}
                            activeOpacity={0.75}
                          >
                            <View
                              style={[styles.priorityDot, { backgroundColor: pConf.dot }]}
                            />
                            <Text
                              style={[
                                styles.priorityBtnText,
                                isSelected && { color: pConf.text, fontWeight: '800' },
                              ]}
                            >
                              {p.toUpperCase()}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  {/* Status Selector (If Editing) */}
                  {editingTask ? (
                    <View style={styles.fieldGroup}>
                      <Text style={styles.label}>STATUS</Text>
                      <View style={styles.statusGrid}>
                        {STATUSES.map((s) => {
                          const isSelected = status === s.id;
                          return (
                            <TouchableOpacity
                              key={s.id}
                              style={[
                                styles.statusBtn,
                                isSelected && styles.statusBtnSelected,
                              ]}
                              onPress={() => setStatus(s.id)}
                              activeOpacity={0.75}
                            >
                              <Text
                                style={[
                                  styles.statusBtnText,
                                  isSelected && styles.statusBtnTextSelected,
                                ]}
                              >
                                {s.label}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  ) : null}

                  {/* Due Date Shortcuts */}
                  <View style={styles.fieldGroup}>
                    <View style={styles.labelRow}>
                      <Text style={styles.label}>DUE DATE</Text>
                      {dueDate ? (
                        <Text style={styles.selectedDateText}>Selected: {dueDate}</Text>
                      ) : null}
                    </View>

                    <View style={styles.dateShortcuts}>
                      <TouchableOpacity
                        style={styles.dateShortcutBtn}
                        onPress={() => handleQuickDate('today')}
                      >
                        <Feather name="calendar" size={11} color={colors.teal} />
                        <Text style={styles.dateShortcutText}>Today</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.dateShortcutBtn}
                        onPress={() => handleQuickDate('tomorrow')}
                      >
                        <Feather name="clock" size={11} color={colors.indigoLight} />
                        <Text style={styles.dateShortcutText}>Tomorrow</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.dateShortcutBtn}
                        onPress={() => handleQuickDate('week')}
                      >
                        <Feather name="calendar" size={11} color={colors.amber} />
                        <Text style={styles.dateShortcutText}>Next Week</Text>
                      </TouchableOpacity>

                      {dueDate ? (
                        <TouchableOpacity
                          style={[styles.dateShortcutBtn, styles.dateClearBtn]}
                          onPress={() => handleQuickDate('clear')}
                        >
                          <Feather name="x" size={11} color={colors.rose} />
                          <Text style={[styles.dateShortcutText, { color: colors.rose }]}>
                            Clear
                          </Text>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </View>

                  {/* Submit Button */}
                  <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={handleSubmit}
                    disabled={saving}
                    activeOpacity={0.85}
                  >
                    {saving ? (
                      <ActivityIndicator size="small" color="#090d16" />
                    ) : (
                      <View style={styles.submitRow}>
                        <Feather
                          name={editingTask ? 'check' : 'plus'}
                          size={18}
                          color="#090d16"
                          strokeWidth={2.5}
                        />
                        <Text style={styles.submitBtnText}>
                          {editingTask ? 'Save Changes' : 'Create Task'}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.3)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.rose,
  },
  form: {
    gap: 14,
  },
  fieldGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.6,
  },
  selectedDateText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.teal,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontSize: 14,
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  chipsRow: {
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  priorityGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    borderRadius: 12,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  statusGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 9,
    borderRadius: 12,
  },
  statusBtnSelected: {
    borderColor: colors.teal,
    backgroundColor: 'rgba(20, 184, 166, 0.12)',
  },
  statusBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  statusBtnTextSelected: {
    color: colors.teal,
    fontWeight: '800',
  },
  dateShortcuts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dateShortcutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },
  dateClearBtn: {
    borderColor: 'rgba(244, 63, 94, 0.25)',
  },
  dateShortcutText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  submitBtn: {
    backgroundColor: colors.teal,
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: colors.teal,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  submitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#090d16',
  },
});

export default TaskModal;
