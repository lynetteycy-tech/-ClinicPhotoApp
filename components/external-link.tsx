import React from 'react';
import { Linking, Pressable, type PressableProps } from 'react-native';

export function ExternalLink({ href, ...rest }: PressableProps & { href: string }) {
  return (
    <Pressable
      {...rest}
      onPress={(e) => {
        rest.onPress?.(e);
        Linking.openURL(href);
      }}
    />
  );
}
