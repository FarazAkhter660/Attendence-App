import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Button} from '../../components/Button/Button';
import {Input} from '../../components/Input/Input';
import {createStaff} from '../../database/repositories/staffRepository';
import type {AdminStackParamList} from '../../types';
import {toUserMessage} from '../../utils/errors';

export function AddStaffScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    employeeId?: string;
  }>({});

  const onContinue = async () => {
    const nextErrors: typeof fieldErrors = {};
    if (!name.trim()) {
      nextErrors.name = 'Staff name is required.';
    }
    if (!employeeId.trim()) {
      nextErrors.employeeId = 'Employee ID is required.';
    }
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const staff = await createStaff(name, employeeId.toUpperCase());
      navigation.replace('FaceEnrollment', {
        staffId: staff.id,
        staffName: staff.name,
        employeeId: staff.employeeId,
      });
    } catch (createError) {
      if (
        createError instanceof Error &&
        createError.message === 'DUPLICATE_EMPLOYEE_ID'
      ) {
        setFieldErrors({employeeId: 'This employee ID is already in use.'});
      } else {
        setError(toUserMessage(createError));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background px-6 pt-6">
      <Text className="mb-6 text-base text-text-secondary">
        Create a staff record, then enrol their face using the front camera.
      </Text>
      <Input
        label="Staff Name"
        value={name}
        onChangeText={setName}
        error={fieldErrors.name}
        placeholder="Rahul Kumar"
      />
      <Input
        label="Employee ID"
        value={employeeId}
        onChangeText={setEmployeeId}
        autoCapitalize="characters"
        error={fieldErrors.employeeId}
        placeholder="EMP002"
      />
      {error ? <Text className="mb-4 text-sm text-error">{error}</Text> : null}
      <Button
        title="Continue to Face Enrolment"
        loading={loading}
        onPress={onContinue}
      />
    </View>
  );
}
