import React from 'react';
import {Pressable, Text, View} from 'react-native';
import type {Staff} from '../../types';

interface StaffCardProps {
  staff: Staff;
  onPress: () => void;
}

export function StaffCard({staff, onPress}: StaffCardProps) {
  const enrolled = Boolean(staff.faceEmbedding);

  return (
    <Pressable
      onPress={onPress}
      className="mb-3 rounded-xl bg-white p-4 shadow-sm"
      accessibilityRole="button">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-lg font-semibold text-text-primary">
            {staff.name}
          </Text>
          <Text className="mt-1 text-sm text-text-secondary">
            {staff.employeeId}
          </Text>
        </View>
        <View
          className={`rounded-full px-3 py-1 ${enrolled ? 'bg-green-100' : 'bg-amber-100'}`}>
          <Text
            className={`text-xs font-semibold ${enrolled ? 'text-success' : 'text-amber-700'}`}>
            {enrolled ? 'Face Enrolled ✓' : 'Not Enrolled'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
