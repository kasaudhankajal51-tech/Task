import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useTasks } from '../context/TaskContext';

export const MetricsCard = () => {
  const { stats, filters, setFilters } = useTasks();

  const cards = [
    {
      id: 'all',
      title: 'Total Tasks',
      value: stats.total,
      icon: <Feather name="layers" size={15} color={colors.indigo} />,
      bgIcon: 'rgba(99, 102, 241, 0.12)',
      filterVal: 'all',
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      value: stats.inProgress,
      icon: <Ionicons name="flame-outline" size={16} color={colors.amber} />,
      bgIcon: 'rgba(245, 158, 11, 0.12)',
      filterVal: 'in-progress',
    },
    {
      id: 'completed',
      title: 'Completed',
      value: stats.completed,
      icon: <Feather name="check-circle" size={15} color={colors.emerald} />,
      bgIcon: 'rgba(16, 185, 129, 0.12)',
      filterVal: 'completed',
    },
    {
      id: 'high',
      title: 'High Priority',
      value: stats.highPriority,
      icon: <Feather name="alert-triangle" size={15} color={colors.rose} />,
      bgIcon: 'rgba(244, 63, 94, 0.12)',
      filterVal: 'high',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Progress banner */}
      <View style={styles.progressBanner}>
        <View style={styles.progressHeader}>
          <View style={styles.progressLabelRow}>
            <Feather name="trending-up" size={14} color={colors.teal} />
            <Text style={styles.progressTitle}>Overall Efficiency</Text>
          </View>
          <Text style={styles.progressPercent}>{stats.completionRate}%</Text>
        </View>

        {/* Bar */}
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${stats.completionRate}%` }]} />
        </View>
      </View>

      {/* Scrollable metrics */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsScroll}
      >
        {cards.map((c) => {
          const isActive =
            c.id === 'high'
              ? filters.priority === 'high'
              : filters.status === c.filterVal;

          return (
            <TouchableOpacity
              key={c.id}
              style={[styles.card, isActive && styles.cardActive]}
              onPress={() => {
                if (c.id === 'high') {
                  setFilters((prev) => ({
                    ...prev,
                    priority: prev.priority === 'high' ? 'all' : 'high',
                  }));
                } else {
                  setFilters((prev) => ({
                    ...prev,
                    status: prev.status === c.filterVal ? 'all' : c.filterVal,
                  }));
                }
              }}
              activeOpacity={0.7}
            >
              <View style={styles.cardTop}>
                <Text style={styles.cardTitle}>{c.title}</Text>
                <View style={[styles.iconWrap, { backgroundColor: c.bgIcon }]}>
                  {c.icon}
                </View>
              </View>
              <Text style={styles.cardValue}>{c.value}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  progressBanner: {
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.teal,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: colors.surfaceLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.teal,
    borderRadius: 3,
  },
  cardsScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  card: {
    width: 120,
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardActive: {
    borderColor: colors.teal,
    backgroundColor: 'rgba(20, 184, 166, 0.08)',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    flex: 1,
  },
  iconWrap: {
    padding: 4,
    borderRadius: 6,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
});

export default MetricsCard;
