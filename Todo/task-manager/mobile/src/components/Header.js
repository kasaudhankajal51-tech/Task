import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';

export const Header = () => {
  const { user } = useAuth();
  const { backendConnected, openServerModal, openProfileModal } = useTasks();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const firstName = user?.name ? user.name.split(' ')[0] : 'User';

  return (
    <View style={styles.container}>
      {/* Left: User Avatar & Greeting */}
      <TouchableOpacity
        style={styles.profileBtn}
        onPress={openProfileModal}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.avatarBadge,
            { backgroundColor: user?.avatarColor || colors.teal },
          ]}
        >
          <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
        </View>

        <View>
          <View style={styles.greetingRow}>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{firstName} 👋</Text>
          </View>
          <Text style={styles.workspaceTag}>Personal Workspace</Text>
        </View>
      </TouchableOpacity>

      {/* Right: Live Connection & Settings */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.statusPill,
            backendConnected ? styles.statusPillConnected : styles.statusPillDisconnected,
          ]}
          onPress={openServerModal}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.statusDot,
              backendConnected ? styles.statusDotConnected : styles.statusDotDisconnected,
            ]}
          />
          <Feather
            name="cloud"
            size={11}
            color={backendConnected ? colors.emerald : colors.rose}
          />
          <Text
            style={[
              styles.statusText,
              backendConnected ? styles.statusTextConnected : styles.statusTextDisconnected,
            ]}
          >
            {backendConnected ? 'Atlas Live' : 'Offline'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={openProfileModal}
          activeOpacity={0.7}
        >
          <Feather name="menu" size={18} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    width: '100%',
  },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatarBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#090d16',
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  greeting: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  userName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  workspaceTag: {
    fontSize: 10,
    color: colors.teal,
    fontWeight: '700',
    marginTop: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusPillConnected: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  statusPillDisconnected: {
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    borderColor: 'rgba(244, 63, 94, 0.25)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusDotConnected: {
    backgroundColor: colors.emerald,
  },
  statusDotDisconnected: {
    backgroundColor: colors.rose,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusTextConnected: {
    color: colors.emerald,
  },
  statusTextDisconnected: {
    color: colors.rose,
  },
  settingsBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
});

export default Header;
