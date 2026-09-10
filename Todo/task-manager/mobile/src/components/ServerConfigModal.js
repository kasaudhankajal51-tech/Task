import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useTasks } from '../context/TaskContext';
import taskApi, { DEFAULT_API_URL } from '../api/taskApi';

export const ServerConfigModal = ({ isOpen, onClose }) => {
  const taskCtx = useTasks();
  const isServerModalOpen = taskCtx?.isServerModalOpen;
  const closeServerModal = taskCtx?.closeServerModal;
  const apiUrl = taskCtx?.apiUrl || getStoredApiUrl();
  const updateApiUrl = taskCtx?.updateApiUrl || setStoredApiUrl;
  
  const modalVisible = isOpen !== undefined ? isOpen : !!isServerModalOpen;
  const handleClose = onClose || closeServerModal || (() => {});

  const [inputUrl, setInputUrl] = useState(apiUrl);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // 'success' | 'error' | null

  useEffect(() => {
    setInputUrl(apiUrl);
    setTestResult(null);
  }, [apiUrl, modalVisible]);

  if (!modalVisible) return null;

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await taskApi.testConnection(inputUrl);
    setTesting(false);
    setTestResult(res);
  };

  const handleSave = () => {
    updateApiUrl(inputUrl);
    if (onClose) onClose();
  };

  return (
    <Modal
      visible={modalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Feather name="server" size={18} color={colors.teal} />
              <Text style={styles.title}>Backend API Server</Text>
            </View>
            <TouchableOpacity onPress={handleClose}>
              <Feather name="x" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.desc}>
            Mobile app connects to your computer's local IP address or production server.
          </Text>

          {/* Input */}
          <Text style={styles.label}>SERVER URL</Text>
          <TextInput
            style={styles.input}
            value={inputUrl}
            onChangeText={(t) => {
              setInputUrl(t);
              setTestResult(null);
            }}
            placeholder="http://10.19.163.65:5000/api"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Test connection result */}
          {testResult && testResult.ok && (
            <View style={styles.resultSuccess}>
              <Feather name="check-circle" size={14} color={colors.emerald} />
              <Text style={styles.resultTextSuccess}>{testResult.message || 'Successfully connected to backend!'}</Text>
            </View>
          )}

          {testResult && !testResult.ok && (
            <View style={styles.resultError}>
              <Feather name="alert-circle" size={14} color={colors.rose} />
              <Text style={styles.resultTextError}>{testResult.message || 'Cannot connect to this URL'}</Text>
            </View>
          )}

          {/* Quick Preset Buttons */}
          <View style={styles.presetRow}>
            <TouchableOpacity
              style={styles.presetBtn}
              onPress={() => setInputUrl(DEFAULT_API_URL)}
            >
              <Text style={styles.presetText}>Cloud Atlas API (Default Render)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.presetBtn}
              onPress={() => setInputUrl('http://10.19.163.65:5000/api')}
            >
              <Text style={styles.presetText}>Local Computer Wi-Fi (10.19.163.65:5000)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.presetBtn}
              onPress={() => setInputUrl('http://10.0.2.2:5000/api')}
            >
              <Text style={styles.presetText}>Android Emulator (10.0.2.2:5000)</Text>
            </TouchableOpacity>
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.testBtn} onPress={handleTest} disabled={testing}>
              {testing ? (
                <ActivityIndicator size="small" color={colors.teal} />
              ) : (
                <Text style={styles.testText}>Test Connection</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveText}>Save & Connect</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  desc: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 15,
    marginBottom: 14,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    color: colors.textPrimary,
    fontSize: 12,
  },
  resultSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  resultTextSuccess: {
    fontSize: 11,
    color: colors.emerald,
    fontWeight: '600',
  },
  resultError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
  },
  resultTextError: {
    fontSize: 11,
    color: colors.rose,
    fontWeight: '600',
  },
  presetRow: {
    marginTop: 10,
    gap: 6,
  },
  presetBtn: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: colors.surfaceLight,
    alignSelf: 'flex-start',
  },
  presetText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  testBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.teal,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#090d16',
  },
});

export default ServerConfigModal;
