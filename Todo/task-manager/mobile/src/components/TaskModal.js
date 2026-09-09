import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useTasks } from '../context/TaskContext';

export const TaskModal = () => {
  const { isTaskModalOpen, editingTask, closeTaskModal, addTask, editTask } = useTasks();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || '',
        description: editingTask.description || '',
        priority: editingTask.priority || 'medium',
        status: editingTask.status || 'pending',
        dueDate: editingTask.dueDate ? editingTask.dueDate.split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        dueDate: '',
      });
    }
  }, [editingTask, isTaskModalOpen]);

  if (!isTaskModalOpen) return null;

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    setSubmitting(true);
    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      status: formData.status,
      dueDate: formData.dueDate || null,
      completed: formData.status === 'completed',
    };

    if (editingTask) {
      await editTask(editingTask._id, payload);
    } else {
      await addTask(payload);
    }
    setSubmitting(false);
  };

  const setQuickDate = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setFormData((prev) => ({ ...prev, dueDate: d.toISOString().split('T')[0] }));
  };

  return (
    <Modal
      visible={isTaskModalOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={closeTaskModal}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
      >
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </Text>
            <TouchableOpacity onPress={closeTaskModal} style={styles.closeBtn}>
              <Feather name="x" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Title */}
            <Text style={styles.label}>
              TITLE <Text style={{ color: colors.rose }}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Build Mobile UI screen"
              placeholderTextColor={colors.textMuted}
              value={formData.title}
              onChangeText={(t) => setFormData({ ...formData, title: t })}
              maxLength={100}
            />

            {/* Description */}
            <Text style={styles.label}>DESCRIPTION</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add details, links, or notes..."
              placeholderTextColor={colors.textMuted}
              value={formData.description}
              onChangeText={(t) => setFormData({ ...formData, description: t })}
              multiline
              numberOfLines={3}
            />

            {/* Priority */}
            <Text style={styles.label}>PRIORITY</Text>
            <View style={styles.priorityRow}>
              {(['low', 'medium', 'high']).map((p) => {
                const isSelected = formData.priority === p;
                const conf = colors.priority[p];
                return (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.priorityOption,
                      isSelected && {
                        backgroundColor: conf.bg,
                        borderColor: conf.border,
                      },
                    ]}
                    onPress={() => setFormData({ ...formData, priority: p })}
                  >
                    <View style={[styles.priorityDot, { backgroundColor: conf.dot }]} />
                    <Text
                      style={[
                        styles.priorityOptionText,
                        isSelected && { color: conf.text, fontWeight: '700' },
                      ]}
                    >
                      {p.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Status */}
            <Text style={styles.label}>STATUS</Text>
            <View style={styles.statusRow}>
              {[
                { label: 'To Do', val: 'pending' },
                { label: 'In Progress', val: 'in-progress' },
                { label: 'Completed', val: 'completed' },
              ].map((s) => {
                const isSelected = formData.status === s.val;
                return (
                  <TouchableOpacity
                    key={s.val}
                    style={[styles.statusOption, isSelected && styles.statusOptionActive]}
                    onPress={() => setFormData({ ...formData, status: s.val })}
                  >
                    <Text
                      style={[
                        styles.statusOptionText,
                        isSelected && styles.statusOptionTextActive,
                      ]}
                    >
                      {s.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Due Date */}
            <Text style={styles.label}>DUE DATE (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 2026-09-20"
              placeholderTextColor={colors.textMuted}
              value={formData.dueDate}
              onChangeText={(t) => setFormData({ ...formData, dueDate: t })}
            />

            {/* Quick date presets */}
            <View style={styles.presetsRow}>
              <TouchableOpacity style={styles.presetBtn} onPress={() => setQuickDate(0)}>
                <Text style={styles.presetText}>Today</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.presetBtn} onPress={() => setQuickDate(1)}>
                <Text style={styles.presetText}>Tomorrow</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.presetBtn} onPress={() => setQuickDate(7)}>
                <Text style={styles.presetText}>+1 Week</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={closeTaskModal}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#090d16" />
              ) : (
                <Text style={styles.submitText}>
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: colors.borderLight,
    maxHeight: '88%',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: colors.surfaceLight,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
    marginBottom: 6,
    marginTop: 10,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 13,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityOptionText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusOptionActive: {
    backgroundColor: 'rgba(20, 184, 166, 0.15)',
    borderColor: colors.teal,
  },
  statusOptionText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  statusOptionTextActive: {
    color: colors.teal,
    fontWeight: '700',
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  presetBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.surfaceLight,
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  submitBtn: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.teal,
  },
  submitText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#090d16',
  },
});

export default TaskModal;
