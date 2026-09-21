import React from 'react';
import {Text, View} from 'react-native';
import {useNavigation, useRoute, type RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Button} from '../../components/Button/Button';
import type {StaffStackParamList} from '../../types';
import {formatDate, formatTime} from '../../utils/date';

export function AttendanceResultScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<StaffStackParamList>>();
  const route = useRoute<RouteProp<StaffStackParamList, 'AttendanceResult'>>();
  const {success, message, timestamp} = route.params;

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text
        className={`text-2xl font-bold ${success ? 'text-success' : 'text-error'}`}>
        {success ? 'Attendance saved' : 'Attendance not recorded'}
      </Text>
      <Text className="mt-4 text-center text-base text-text-secondary">
        {message}
      </Text>
      {success && timestamp ? (
        <Text className="mt-3 text-center text-text-primary">
          {formatDate(timestamp)} · {formatTime(timestamp)}
        </Text>
      ) : null}
      <View className="mt-8 w-full">
        <Button title="Back to Home" onPress={() => navigation.navigate('StaffHome')} />
      </View>
    </View>
  );
}
