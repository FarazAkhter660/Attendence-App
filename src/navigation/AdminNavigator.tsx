import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AddStaffScreen} from '../screens/admin/AddStaffScreen';
import {FaceEnrollmentScreen} from '../screens/admin/FaceEnrollmentScreen';
import {StaffListScreen} from '../screens/admin/StaffListScreen';
import {StaffProfileScreen} from '../screens/admin/StaffProfileScreen';
import type {AdminStackParamList} from '../types';

const Stack = createNativeStackNavigator<AdminStackParamList>();

export function AdminNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: '#1976D2'},
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {fontWeight: '600'},
      }}>
      <Stack.Screen
        name="StaffList"
        component={StaffListScreen}
        options={{title: 'Staff Management'}}
      />
      <Stack.Screen
        name="AddStaff"
        component={AddStaffScreen}
        options={{title: 'Add Staff'}}
      />
      <Stack.Screen
        name="FaceEnrollment"
        component={FaceEnrollmentScreen}
        options={{title: 'Face Enrolment'}}
      />
      <Stack.Screen
        name="StaffProfile"
        component={StaffProfileScreen}
        options={{title: 'Staff Profile'}}
      />
    </Stack.Navigator>
  );
}
