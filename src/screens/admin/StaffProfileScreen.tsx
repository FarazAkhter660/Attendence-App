import React, {useCallback, useState} from 'react';
import {ActivityIndicator, FlatList, Pressable, Text, View} from 'react-native';
import {useFocusEffect, useNavigation, useRoute, type RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AttendanceCard} from '../../components/AttendanceCard/AttendanceCard';
import {getAttendanceForStaff} from '../../database/repositories/attendanceRepository';
import {getStaffById} from '../../database/repositories/staffRepository';
import type {AdminStackParamList, Attendance, Staff} from '../../types';
import {toUserMessage} from '../../utils/errors';

export function StaffProfileScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
  const route = useRoute<RouteProp<AdminStackParamList, 'StaffProfile'>>();
  const [staff, setStaff] = useState<Staff | null>(null);
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const nextStaff = await getStaffById(route.params.staffId);
      const history = await getAttendanceForStaff(route.params.staffId);
      setStaff(nextStaff);
      setRecords(history);
    } catch (loadError) {
      setError(toUserMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [route.params.staffId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#1976D2" />
      </View>
    );
  }

  if (error || !staff) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-center text-error">
          {error ?? 'Staff member was not found.'}
        </Text>
      </View>
    );
  }

  const enrolled = Boolean(staff.faceEmbedding);

  return (
    <FlatList
      className="flex-1 bg-background"
      contentContainerClassName="p-4"
      data={records}
      keyExtractor={item => String(item.id)}
      ListHeaderComponent={
        <View className="mb-4 rounded-xl bg-white p-4">
          <Text className="text-xl font-bold text-text-primary">{staff.name}</Text>
          <Text className="mt-1 text-text-secondary">{staff.employeeId}</Text>
          <Text className={`mt-3 font-semibold ${enrolled ? 'text-success' : 'text-amber-700'}`}>
            {enrolled ? 'Face Enrolled' : 'Not Enrolled'}
          </Text>
          {!enrolled ? (
            <Pressable
              className="mt-4 min-h-[44px] items-center justify-center rounded-lg bg-primary"
              onPress={() =>
                navigation.navigate('FaceEnrollment', {
                  staffId: staff.id,
                  staffName: staff.name,
                  employeeId: staff.employeeId,
                })
              }>
              <Text className="font-semibold text-white">Enrol Face</Text>
            </Pressable>
          ) : null}
          <Text className="mt-5 text-lg font-semibold text-text-primary">
            Attendance History
          </Text>
        </View>
      }
      ListEmptyComponent={
        <Text className="mt-8 text-center text-text-secondary">
          No attendance records yet.
        </Text>
      }
      renderItem={({item}) => <AttendanceCard record={item} />}
    />
  );
}
