import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import ServerConfigModal from '../components/ServerConfigModal';

export const AuthScreen = () => {
  const { login, register, isLoading, authError, setAuthError } = useAuth();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);

  const handleSubmit = async () => {
    setAuthError(null);
    if (isRegisterMode) {
      if (!name.trim()) {
        setAuthError('Please enter your full name');
        return;
      }
      if (!email.trim() || !password) {
        setAuthError('Please enter both email and password');
        return;
      }
      if (password.length < 6) {
        setAuthError('Password must be at least 6 characters');
        return;
      }
      await register(name.trim(), email.trim(), password);
    } else {
      if (!email.trim() || !password) {
        setAuthError('Please enter both email and password');
        return;
      }
      await login(email.trim(), password);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Bar with Server Config */}
          <View style={styles.topBar}>
            <View style={styles.badgePill}>
              <View style={styles.onlineDot} />
              <Text style={styles.badgePillText}>Atlas Cloud Sync</Text>
            </View>
            <TouchableOpacity
              style={styles.serverBtn}
              onPress={() => setIsServerModalOpen(true)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="settings" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Hero Branding */}
          <View style={styles.heroSection}>
            <View style={styles.logoBadge}>
              <Feather name="check-circle" size={36} color={colors.teal} />
            </View>
            <Text style={styles.brandTitle}>
              Task<Text style={styles.brandHighlight}>Flow</Text>
            </Text>
            <Text style={styles.brandSubtitle}>
              Personalized Multi-User Task Suite
            </Text>
            <Text style={styles.brandTagline}>
              Har user ka apna private workspace. Aapka data 100% private rahega.
            </Text>
          </View>

          {/* Auth Card Container */}
          <View style={styles.authCard}>
            {/* Mode Toggle Switch */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tabBtn, !isRegisterMode && styles.tabBtnActive]}
                onPress={() => {
                  setIsRegisterMode(false);
                  setAuthError(null);
                }}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.tabBtnText,
                    !isRegisterMode && styles.tabBtnTextActive,
                  ]}
                >
                  Sign In
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabBtn, isRegisterMode && styles.tabBtnActive]}
                onPress={() => {
                  setIsRegisterMode(true);
                  setAuthError(null);
                }}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.tabBtnText,
                    isRegisterMode && styles.tabBtnTextActive,
                  ]}
                >
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>

            {/* Error Notification */}
            {authError ? (
              <View style={styles.errorBox}>
                <Feather name="alert-circle" size={16} color={colors.rose} />
                <Text style={styles.errorText}>{authError}</Text>
              </View>
            ) : null}

            {/* Input Form */}
            <View style={styles.form}>
              {isRegisterMode ? (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>YOUR FULL NAME</Text>
                  <View style={styles.inputWrapper}>
                    <Feather
                      name="user"
                      size={18}
                      color={colors.textSecondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Kajal Kasaudhan"
                      placeholderTextColor={colors.textDisabled}
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                  </View>
                </View>
              ) : null}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                <View style={styles.inputWrapper}>
                  <Feather
                    name="mail"
                    size={18}
                    color={colors.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. user@example.com"
                    placeholderTextColor={colors.textDisabled}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>PASSWORD</Text>
                <View style={styles.inputWrapper}>
                  <Feather
                    name="lock"
                    size={18}
                    color={colors.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="At least 6 characters"
                    placeholderTextColor={colors.textDisabled}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeBtn}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Feather
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={18}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSubmit}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#090d16" />
                ) : (
                  <View style={styles.submitRow}>
                    <Text style={styles.submitBtnText}>
                      {isRegisterMode ? 'Create My Account' : 'Sign In to Workspace'}
                    </Text>
                    <Feather name="arrow-right" size={18} color="#090d16" strokeWidth={2.5} />
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Privacy note */}
            <View style={styles.privacyNote}>
              <Feather name="shield" size={13} color={colors.teal} />
              <Text style={styles.privacyText}>
                Your tasks are encrypted and strictly visible only to your account.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Server Config Modal */}
      <ServerConfigModal
        isOpen={isServerModalOpen}
        onClose={() => setIsServerModalOpen(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.25)',
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.teal,
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.teal,
  },
  serverBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: 'rgba(20, 184, 166, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(20, 184, 166, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: colors.teal,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  brandTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  brandHighlight: {
    color: colors.teal,
  },
  brandSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 4,
  },
  brandTagline: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 16,
    lineHeight: 18,
  },
  authCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLight,
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
  },
  tabBtnTextActive: {
    color: colors.textPrimary,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.3)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.rose,
    flex: 1,
    lineHeight: 16,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  eyeBtn: {
    padding: 4,
  },
  submitBtn: {
    backgroundColor: colors.teal,
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: colors.teal,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
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
    letterSpacing: -0.2,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  privacyText: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    flex: 1,
  },
});

export default AuthScreen;
