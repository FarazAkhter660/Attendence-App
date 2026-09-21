import React, {useState} from 'react';
import {Alert} from 'react-native';
import {useNavigation, useRoute, type RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FaceCaptureCamera} from '../../components/FaceCaptureCamera';
import {enrollStaffFace} from '../../services/EnrollmentService';
import type {AdminStackParamList} from '../../types';
import {toUserMessage} from '../../utils/errors';

export function FaceEnrollmentScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
  const route = useRoute<RouteProp<AdminStackParamList, 'FaceEnrollment'>>();
  const {staffId, staffName} = route.params;
  const [processing, setProcessing] = useState(false);

  const onCapture = async (photoPath: string) => {
    setProcessing(true);
    try {
      await enrollStaffFace(staffId, photoPath);
      Alert.alert('Face enrolled successfully.', `${staffName} can now mark attendance.`, [
        {text: 'OK', onPress: () => navigation.navigate('StaffList')},
      ]);
    } catch (error) {
      throw new Error(toUserMessage(error));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <FaceCaptureCamera
      actionLabel="Capture & Enrol Face"
      processing={processing}
      onCapture={onCapture}
    />
  );
}
