import React, {useRef, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {Camera, useCameraDevice, useCameraPermission} from 'react-native-vision-camera';
import {Button} from '../Button/Button';
import {Errors, toUserMessage} from '../../utils/errors';

interface FaceCaptureCameraProps {
  actionLabel: string;
  processing?: boolean;
  onCapture: (photoPath: string) => Promise<void>;
}

export function FaceCaptureCamera({
  actionLabel,
  processing = false,
  onCapture,
}: FaceCaptureCameraProps) {
  const camera = useRef<Camera>(null);
  const device = useCameraDevice('front');
  const {hasPermission, requestPermission} = useCameraPermission();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const capture = async () => {
    try {
      setError(null);
      if (!hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          throw Errors.cameraPermission();
        }
      }
      if (!camera.current) {
        throw Errors.cameraFailure();
      }
      setBusy(true);
      const photo = await camera.current.takePhoto({flash: 'off'});
      await onCapture(photo.path);
    } catch (captureError) {
      setError(toUserMessage(captureError));
    } finally {
      setBusy(false);
    }
  };

  if (!hasPermission) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <Text className="mb-4 text-center text-base text-white">
          Camera permission is required to continue.
        </Text>
        <Button title="Allow camera" onPress={requestPermission} />
      </View>
    );
  }

  if (!device) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-6">
        <Text className="text-center text-base text-white">
          Front camera is not available on this device.
        </Text>
      </View>
    );
  }

  const isWorking = busy || processing;

  return (
    <View className="flex-1 bg-black">
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={!isWorking}
        photo={true}
        enableZoomGesture={false}
      />
      <View className="absolute inset-x-0 top-16 items-center px-6">
        <View className="rounded-xl bg-black/55 px-4 py-3">
          <Text className="text-center text-base font-medium text-white">
            Position your face inside the frame.
          </Text>
          <Text className="mt-1 text-center text-sm text-gray-200">
            Only one person should be visible.
          </Text>
        </View>
      </View>
      <View className="absolute inset-x-10 top-1/3 h-64 rounded-3xl border-2 border-white/80" />
      <View className="absolute inset-x-0 bottom-10 px-6">
        {error ? (
          <Text className="mb-3 text-center text-sm text-red-300">{error}</Text>
        ) : null}
        {isWorking ? (
          <View className="items-center">
            <ActivityIndicator color="#FFFFFF" size="large" />
            <Text className="mt-3 text-white">Processing face…</Text>
          </View>
        ) : (
          <Button title={actionLabel} onPress={capture} />
        )}
      </View>
    </View>
  );
}
