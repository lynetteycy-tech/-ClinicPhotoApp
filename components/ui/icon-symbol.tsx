import { Ionicons } from '@expo/vector-icons';
import React from 'react';

const nameMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  'house.fill': 'home',
  'paperplane.fill': 'paper-plane',
  'chevron.left.forwardslash.chevron.right': 'code-slash',
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}) {
  const mapped = nameMap[name] ?? ('help' as keyof typeof Ionicons.glyphMap);
  return <Ionicons name={mapped} size={size} color={color} style={style} />;
}
