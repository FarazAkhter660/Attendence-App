import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FaceCaptureCamera} from '../../components/FaceCaptureCamera';
import {useAuth} from '../../hooks/AuthContext';
import {markAttendance} from '../../services/AttendanceService';
import type {StaffStackParamList} from '../../types';
import {toUserMessage} from '../../utils/errors';

export function AttendanceCameraScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<StaffStackParamList>>();
  const {user} = useAuth();
  const [processing, setProcessing] = useState(false);

  const onCapture = async (photoPath: string) => {
    if (!user?.staffDbId) {
      throw new Error('Your face has not been enrolled. Please contact the administrator.');
    }
    setProcessing(true);
    try {
      const record = await markAttendance(user.staffDbId, photoPath);
      navigation.replace('AttendanceResult', {
        success: true,
        message: 'Attendance recorded successfully.',
        timestamp: record.timestamp,
      });
    } catch (error) {
      navigation.replace('AttendanceResult', {
        success: false,
        message: toUserMessage(error),
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <FaceCaptureCamera
      actionLabel="Capture Selfie"
      processing={processing}
      onCapture={onCapture}
    />
  );
}
