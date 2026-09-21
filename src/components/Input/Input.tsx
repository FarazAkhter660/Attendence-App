import React from 'react';
import {Text, TextInput, View, type TextInputProps} from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export function Input({label, error, className, ...props}: InputProps & {className?: string}) {
  return (
    <View className="mb-4">
      <Text className="mb-1.5 text-sm font-medium text-text-primary">{label}</Text>
      <TextInput
        className={`min-h-[48px] rounded-lg border bg-white px-4 text-base text-text-primary ${error ? 'border-error' : 'border-gray-300'} ${className ?? ''}`}
        placeholderTextColor="#9E9E9E"
        {...props}
      />
      {error ? (
        <Text className="mt-1 text-sm text-error">{error}</Text>
      ) : null}
    </View>
  );
}
