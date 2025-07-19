import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BibleSearchScreen() {
  return (
    <View style={styles.container}>
      <Text>Bible Search Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
