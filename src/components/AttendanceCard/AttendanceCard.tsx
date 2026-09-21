import React from 'react';
import {Image, Text, View} from 'react-native';
import type {Attendance} from '../../types';
import {formatDate, formatTime} from '../../utils/date';
import {toDisplayUri} from '../../storage/ImageStorageService';

interface AttendanceCardProps {
  record: Attendance;
}

export function AttendanceCard({record}: AttendanceCardProps) {
  return (
    <View className="mb-4 overflow-hidden rounded-xl bg-white shadow-sm">
      <Image
        source={{uri: toDisplayUri(record.selfiePath)}}
        className="h-52 w-full bg-gray-200"
        resizeMode="cover"
        accessibilityLabel="Attendance selfie"
      />
      <View className="p-4">
        <Text className="text-base font-semibold text-text-primary">
          {formatDate(record.timestamp)}
        </Text>
        <Text className="mt-1 text-sm text-text-secondary">
          {formatTime(record.timestamp)}
        </Text>
        <Text className="mt-3 text-sm text-text-primary">
          Latitude: {record.latitude.toFixed(6)}
        </Text>
        <Text className="mt-1 text-sm text-text-primary">
          Longitude: {record.longitude.toFixed(6)}
        </Text>
      </View>
    </View>
  );
}
