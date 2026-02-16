import { Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'link' | 'defaultSemiBold';
};

export function ThemedText({ style, ...rest }: ThemedTextProps) {
  return <Text style={style} {...rest} />;
}
