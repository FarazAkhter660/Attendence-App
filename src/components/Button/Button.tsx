import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  type PressableProps,
} from 'react-native';

interface ButtonProps extends PressableProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function Button({
  title,
  loading = false,
  variant = 'primary',
  disabled,
  className,
  ...props
}: ButtonProps & {className?: string}) {
  const isDisabled = disabled || loading;

  const variantClasses = {
    primary: 'bg-primary active:bg-primary-dark',
    secondary: 'bg-gray-600 active:bg-gray-700',
    outline: 'border border-primary bg-transparent active:bg-blue-50',
  };

  const textClasses = {
    primary: 'text-white',
    secondary: 'text-white',
    outline: 'text-primary',
  };

  return (
    <Pressable
      className={`min-h-[48px] items-center justify-center rounded-lg px-6 py-3 ${variantClasses[variant]} ${isDisabled ? 'opacity-50' : ''} ${className ?? ''}`}
      disabled={isDisabled}
      accessibilityRole="button"
      {...props}>
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#1976D2' : '#FFFFFF'} />
      ) : (
        <Text className={`text-base font-semibold ${textClasses[variant]}`}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}
