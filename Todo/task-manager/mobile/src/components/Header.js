import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useTasks } from '../context/TaskContext';

export const Header = () => {
  const { backendConnected, openServerModal } = useTasks();

  return (
    <View style={styles.container}>
      {/* Brand Logo & Name */}
      <View style={styles.brandContainer}>
        <View style={styles.logoIcon}>
          <Feather name="check-square" size={20} color={colors.teal} />
        </View>
        <View>
          <View style={styles.titleRow}>
            <Text style={styles.title}>TaskFlow</Text>
            <View style={styles.proBadge}>
              <Text style={styles.proText}>PRO</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>Mobile Task Suite</Text>
        </View>
      </View>

      {/* Right: Server Status & Settings */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.statusPill,
            backendConnected ? styles.statusPillConnected : styles.statusPillDisconnected,
          ]}
          onPress={openServerModal}
        >
          <View
            style={[
              styles.statusDot,
              backendConnected ? styles.statusDotConnected : styles.statusDotDisconnected,
            ]}
          />
          <Feather
            name="server"
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

        <TouchableOpacity style={styles.settingsBtn} onPress={openServerModal}>
          <Feather name="settings" size={16} color={colors.textSecondary} />
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
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(20, 184, 166, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  proBadge: {
    backgroundColor: 'rgba(20, 184, 166, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.3)',
  },
  proText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.teal,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 10,
    color: colors.textMuted,
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
    paddingVertical: 4,
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
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
});

export default Header;
