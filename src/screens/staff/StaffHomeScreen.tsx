import React, {useCallback, useLayoutEffect, useState} from 'react';
import {Alert, Pressable, Text, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Button} from '../../components/Button/Button';
import {useAuth} from '../../hooks/AuthContext';
import {getStaffById} from '../../database/repositories/staffRepository';
import type {StaffStackParamList} from '../../types';
import {greetingForNow} from '../../utils/date';
import {Errors, toUserMessage} from '../../utils/errors';

export function StaffHomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<StaffStackParamList>>();
  const {user, logout} = useAuth();
  const [enrolled, setEnrolled] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={logout} className="px-2 py-1">
          <Text className="font-semibold text-white">Logout</Text>
        </Pressable>
      ),
    });
  }, [logout, navigation]);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        if (!user?.staffDbId) {
          return;
        }
        try {
          const staff = await getStaffById(user.staffDbId);
          setEnrolled(Boolean(staff?.faceEmbedding));
        } catch (error) {
          console.warn(toUserMessage(error));
        }
      };
      load();
    }, [user?.staffDbId]),
  );

  const onMarkAttendance = () => {
    if (!enrolled) {
      Alert.alert('Face not enrolled', Errors.noEnrollment().userMessage);
      return;
    }
    navigation.navigate('AttendanceCamera');
  };

  return (
    <View className="flex-1 bg-background px-6 pt-10">
      <Text className="text-2xl font-bold text-text-primary">
        {greetingForNow()}, {user?.name}
      </Text>
      <Text className="mt-2 text-base text-text-secondary">
        Employee ID: {user?.employeeId}
      </Text>
      <View className="mt-10">
        <Button title="MARK ATTENDANCE" onPress={onMarkAttendance} />
      </View>
    </View>
  );
}
