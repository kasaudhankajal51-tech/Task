import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';

export const ProfileModal = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { stats, openServerModal } = useTasks();

  if (!isOpen || !user) return null;

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of this device?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            onClose();
            await logout();
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              {/* Top Handle */}
              <View style={styles.handle} />

              {/* Close Button */}
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Feather name="x" size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              {/* User Identity Header */}
              <View style={styles.userHeader}>
                <View
                  style={[
                    styles.avatarBadge,
                    { backgroundColor: user.avatarColor || colors.teal },
                  ]}
                >
                  <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
                </View>

                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>

                <View style={styles.workspacePill}>
                  <Feather name="shield" size={12} color={colors.teal} />
                  <Text style={styles.workspacePillText}>Isolated Private Workspace</Text>
                </View>
              </View>

              {/* Mini Stats Card */}
              <View style={styles.statsCard}>
                <View style={styles.statCol}>
                  <Text style={styles.statVal}>{stats.total}</Text>
                  <Text style={styles.statLabel}>Total Tasks</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statCol}>
                  <Text style={[styles.statVal, { color: colors.emerald }]}>
                    {stats.completed}
                  </Text>
                  <Text style={styles.statLabel}>Completed</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statCol}>
                  <Text style={[styles.statVal, { color: colors.teal }]}>
                    {stats.completionRate}%
                  </Text>
                  <Text style={styles.statLabel}>Efficiency</Text>
                </View>
              </View>

              {/* Actions List */}
              <View style={styles.menuList}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    onClose();
                    openServerModal();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuIconWrap}>
                    <Feather name="server" size={16} color={colors.teal} />
                  </View>
                  <View style={styles.menuContent}>
                    <Text style={styles.menuTitle}>Server Connection</Text>
                    <Text style={styles.menuSubtitle}>Configure MongoDB / Backend URL</Text>
                  </View>
                  <Feather name="chevron-right" size={18} color={colors.textMuted} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.menuItem, styles.logoutItem]}
                  onPress={handleLogout}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.menuIconWrap,
                      { backgroundColor: 'rgba(244, 63, 94, 0.12)' },
                    ]}
                  >
                    <Feather name="log-out" size={16} color={colors.rose} />
                  </View>
                  <View style={styles.menuContent}>
                    <Text style={[styles.menuTitle, { color: colors.rose }]}>
                      Sign Out
                    </Text>
                    <Text style={styles.menuSubtitle}>
                      Disconnect this account on this device
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={18} color={colors.rose} />
                </TouchableOpacity>
              </View>
            </View>
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
    paddingTop: 12,
    paddingBottom: 36,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  handle: {
    width: 38,
    height: 4,
    backgroundColor: colors.borderLight,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  closeBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userHeader: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  avatarBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: colors.textPrimary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#090d16',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  workspacePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  workspacePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.teal,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.surfaceLight,
    borderRadius: 18,
    paddingVertical: 14,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statVal: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
  },
  menuList: {
    gap: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logoutItem: {
    borderColor: 'rgba(244, 63, 94, 0.25)',
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(20, 184, 166, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  menuSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
});

export default ProfileModal;
