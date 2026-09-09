import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useTasks } from '../context/TaskContext';

export const MetricsCard = () => {
  const { stats, filters, setFilters } = useTasks();

  const cards = [
    {
      id: 'all',
      title: 'Total Tasks',
      value: stats.total,
      icon: <Feather name="layers" size={15} color={colors.indigoLight} />,
      bgIcon: 'rgba(99, 102, 241, 0.14)',
      filterKey: 'status',
      filterVal: 'all',
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      value: stats.inProgress,
      icon: <Ionicons name="flame-outline" size={16} color={colors.amber} />,
      bgIcon: 'rgba(245, 158, 11, 0.14)',
      filterKey: 'status',
      filterVal: 'in-progress',
    },
    {
      id: 'completed',
      title: 'Completed',
      value: stats.completed,
      icon: <Feather name="check-circle" size={15} color={colors.emerald} />,
      bgIcon: 'rgba(16, 185, 129, 0.14)',
      filterKey: 'status',
      filterVal: 'completed',
    },
    {
      id: 'high',
      title: 'High Priority',
      value: stats.highPriority,
      icon: <Feather name="zap" size={15} color={colors.rose} />,
      bgIcon: 'rgba(244, 63, 94, 0.14)',
      filterKey: 'priority',
      filterVal: 'high',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Productivity Progress Bar Banner */}
      <View style={styles.progressBanner}>
        <View style={styles.progressHeader}>
          <View style={styles.progressLabelRow}>
            <View style={styles.trendingIconWrap}>
              <Feather name="trending-up" size={13} color={colors.teal} />
            </View>
            <View>
              <Text style={styles.progressTitle}>Productivity Tracker</Text>
              <Text style={styles.progressSubtitle}>
                {stats.completed} of {stats.total} tasks completed
              </Text>
            </View>
          </View>
          <View style={styles.percentBadge}>
            <Text style={styles.progressPercent}>{stats.completionRate}%</Text>
          </View>
        </View>

        {/* Progress Bar Track */}
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.max(stats.completionRate, 3)}%` },
            ]}
          />
        </View>
      </View>

      {/* Horizontal Scrollable Metric Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsScroll}
      >
        {cards.map((c) => {
          const isActive =
            c.filterKey === 'priority'
              ? filters.priority === c.filterVal
              : filters.status === c.filterVal && filters.priority === 'all';

          return (
            <TouchableOpacity
              key={c.id}
              style={[styles.card, isActive && styles.cardActive]}
              onPress={() => {
                if (c.filterKey === 'priority') {
                  setFilters((prev) => ({
                    ...prev,
                    priority: prev.priority === c.filterVal ? 'all' : c.filterVal,
                    status: 'all',
                  }));
                } else {
                  setFilters((prev) => ({
                    ...prev,
                    status: prev.status === c.filterVal ? 'all' : c.filterVal,
                    priority: 'all',
                  }));
                }
              }}
              activeOpacity={0.75}
            >
              <View style={styles.cardTop}>
                <Text style={[styles.cardTitle, isActive && styles.cardTitleActive]}>
                  {c.title}
                </Text>
                <View style={[styles.iconWrap, { backgroundColor: c.bgIcon }]}>
                  {c.icon}
                </View>
              </View>
              <Text style={[styles.cardValue, isActive && styles.cardValueActive]}>
                {c.value}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  progressBanner: {
    padding: 14,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  trendingIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(20, 184, 166, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  progressSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  percentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(20, 184, 166, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.25)',
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '900',
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
    paddingRight: 10,
    gap: 10,
  },
  card: {
    width: 122,
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardActive: {
    borderColor: colors.teal,
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    shadowColor: colors.teal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    flex: 1,
  },
  cardTitleActive: {
    color: colors.teal,
  },
  iconWrap: {
    padding: 4,
    borderRadius: 8,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  cardValueActive: {
    color: colors.tealLight,
  },
});

export default MetricsCard;
