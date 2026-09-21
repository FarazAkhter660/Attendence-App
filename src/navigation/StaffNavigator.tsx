import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AttendanceCameraScreen} from '../screens/staff/AttendanceCameraScreen';
import {AttendanceResultScreen} from '../screens/staff/AttendanceResultScreen';
import {StaffHomeScreen} from '../screens/staff/StaffHomeScreen';
import type {StaffStackParamList} from '../types';

const Stack = createNativeStackNavigator<StaffStackParamList>();

export function StaffNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: '#1976D2'},
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {fontWeight: '600'},
      }}>
      <Stack.Screen
        name="StaffHome"
        component={StaffHomeScreen}
        options={{title: 'Attendance'}}
      />
      <Stack.Screen
        name="AttendanceCamera"
        component={AttendanceCameraScreen}
        options={{title: 'Mark Attendance'}}
      />
      <Stack.Screen
        name="AttendanceResult"
        component={AttendanceResultScreen}
        options={{title: 'Result', headerBackVisible: false}}
      />
    </Stack.Navigator>
  );
}
