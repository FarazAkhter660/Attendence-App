import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button} from '../../components/Button/Button';
import {Input} from '../../components/Input/Input';
import {useAuth} from '../../hooks/AuthContext';
import {toUserMessage} from '../../utils/errors';

export function LoginScreen() {
  const {login} = useAuth();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    employeeId?: string;
    password?: string;
  }>({});

  const onSubmit = async () => {
    const nextErrors: typeof fieldErrors = {};
    if (!employeeId.trim()) {
      nextErrors.employeeId = 'Employee ID is required.';
    }
    if (!password.trim()) {
      nextErrors.password = 'Password is required.';
    }
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await login(employeeId, password);
    } catch (loginError) {
      setError(toUserMessage(loginError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="flex-1 justify-center px-6">
          <Text className="text-3xl font-bold text-primary">Attendance</Text>
          <Text className="mt-2 text-base text-text-secondary">
            Sign in with your employee ID
          </Text>

          <View className="mt-8">
            <Input
              label="Employee ID"
              value={employeeId}
              onChangeText={setEmployeeId}
              autoCapitalize="characters"
              autoCorrect={false}
              error={fieldErrors.employeeId}
              placeholder="EMP001"
            />
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={fieldErrors.password}
              placeholder="Enter password"
            />
            {error ? (
              <Text className="mb-4 text-sm text-error">{error}</Text>
            ) : null}
            <Button title="LOGIN" loading={loading} onPress={onSubmit} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
