import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function ParallaxScrollView({
  headerImage,
  children,
}: {
  headerImage?: React.ReactNode;
  headerBackgroundColor?: { light: string; dark: string };
  children: React.ReactNode;
}) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {headerImage ? <View style={styles.header}>{headerImage}</View> : null}
      <View style={styles.content}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  header: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
