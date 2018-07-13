import React from 'react';
import { Text, StyleSheet } from 'react-native-web';

const Link = ({ href, style, children }) => (
  <Text
    accessibilityRole="link"
    onPress={() => {
      window.open(href, '_blank');
    }}
    style={StyleSheet.compose(
      styles.link,
      style
    )}
  >
    {children}
  </Text>
);

const styles = StyleSheet.create({
  link: {
    color: '#1B95E0',
    textDecorationLine: 'underline',
  },
});

export { Link };
