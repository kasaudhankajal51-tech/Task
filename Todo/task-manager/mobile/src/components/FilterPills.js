import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useTasks } from '../context/TaskContext';

const CATEGORIES = [
  { id: 'all', label: 'All Categories', icon: 'layers' },
  { id: 'Work', label: 'Work', icon: 'briefcase' },
  { id: 'Personal', label: 'Personal', icon: 'user' },
  { id: 'Urgent', label: 'Urgent', icon: 'zap' },
  { id: 'Study', label: 'Study', icon: 'book-open' },
  { id: 'Finance', label: 'Finance', icon: 'dollar-sign' },
  { id: 'Health', label: 'Health', icon: 'heart' },
];

export const FilterPills = () => {
  const { filters, setFilters } = useTasks();

  const handleCategorySelect = (catId) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === catId ? 'all' : catId,
    }));
  };

  const handleSearchChange = (text) => {
    setFilters((prev) => ({ ...prev, search: text }));
  };

  const clearSearch = () => {
    setFilters((prev) => ({ ...prev, search: '' }));
  };

  return (
    <View style={styles.container}>
      {/* Search Input Bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchWrapper}>
          <Feather name="search" size={16} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your tasks or notes..."
            placeholderTextColor={colors.textDisabled}
            value={filters.search}
            onChangeText={handleSearchChange}
          />
          {filters.search ? (
            <TouchableOpacity onPress={clearSearch} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Feather name="x-circle" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Categories Horizontal Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = filters.category === cat.id;
          const catConf = colors.categories[cat.id];

          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryPill,
                isSelected && styles.categoryPillSelected,
                isSelected && catConf && {
                  borderColor: catConf.color,
                  backgroundColor: catConf.bg,
                },
              ]}
              onPress={() => handleCategorySelect(cat.id)}
              activeOpacity={0.7}
            >
              <Feather
                name={cat.icon}
                size={12}
                color={
                  isSelected
                    ? catConf
                      ? catConf.color
                      : colors.teal
                    : colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.categoryText,
                  isSelected && styles.categoryTextSelected,
                  isSelected && catConf && { color: catConf.color },
                ]}
              >
                {cat.label}
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
    marginVertical: 6,
    gap: 8,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '500',
  },
  categoryScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryPillSelected: {
    borderColor: colors.teal,
    backgroundColor: 'rgba(20, 184, 166, 0.12)',
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  categoryTextSelected: {
    color: colors.teal,
  },
});

export default FilterPills;
