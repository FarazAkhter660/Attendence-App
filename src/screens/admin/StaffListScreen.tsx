import React, {useCallback, useLayoutEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StaffCard} from '../../components/StaffCard/StaffCard';
import {useAuth} from '../../hooks/AuthContext';
import {getStaff} from '../../database/repositories/staffRepository';
import type {AdminStackParamList, Staff} from '../../types';
import {toUserMessage} from '../../utils/errors';

export function StaffListScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
  const {logout} = useAuth();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={logout} className="px-2 py-1">
          <Text className="font-semibold text-white">Logout</Text>
        </Pressable>
      ),
    });
  }, [logout, navigation]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setStaff(await getStaff());
    } catch (loadError) {
      setError(toUserMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

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

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="mb-4 text-center text-error">{error}</Text>
        <Pressable onPress={load}>
          <Text className="font-semibold text-primary">Try again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList
        contentContainerClassName="p-4"
        data={staff}
        keyExtractor={item => String(item.id)}
        ListEmptyComponent={
          <View className="mt-20 items-center px-6">
            <Text className="text-base text-text-secondary">
              No staff members yet. Add the first employee.
            </Text>
          </View>
        }
        renderItem={({item}) => (
          <StaffCard
            staff={item}
            onPress={() =>
              navigation.navigate('StaffProfile', {staffId: item.id})
            }
          />
        )}
      />
      <View className="p-4">
        <Pressable
          className="min-h-[48px] items-center justify-center rounded-lg bg-primary"
          onPress={() => navigation.navigate('AddStaff')}>
          <Text className="text-base font-semibold text-white">Add Staff</Text>
        </Pressable>
      </View>
    </View>
  );
}
