import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Pressable } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  const { onPress, onLongPress, accessibilityState, style, children, accessibilityLabel, testID } = props;

  return (
    <Pressable
      accessibilityState={accessibilityState}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      onPress={onPress}
      onLongPress={onLongPress}
      style={style}>
      {children}
    </Pressable>
  );
}
