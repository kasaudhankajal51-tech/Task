import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, LogBox } from 'react-native';

// Ignore harmless Expo CLI disconnected LogBox warning
LogBox.ignoreLogs(['Cannot connect to Expo CLI']);
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { TaskProvider } from './src/context/TaskContext';
import HomeScreen from './src/screens/HomeScreen';
import AuthScreen from './src/screens/AuthScreen';
import colors from './src/theme/colors';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('App Error Caught by Boundary:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorHeader}>Oops! Something went wrong</Text>
          <Text style={styles.errorDetails}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={this.resetError}>
            <Text style={styles.retryButtonText}>Restart App</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const NavigationRoot = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.teal} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return <HomeScreen />;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
          <StatusBar style="light" backgroundColor={colors.surface} />
          <AuthProvider>
            <TaskProvider>
              <NavigationRoot />
            </TaskProvider>
          </AuthProvider>
        </SafeAreaView>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorHeader: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.rose,
    marginBottom: 8,
  },
  errorDetails: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.teal,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#090d16',
    fontWeight: '700',
    fontSize: 14,
  },
});
