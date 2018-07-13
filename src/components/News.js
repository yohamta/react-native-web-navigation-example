import React from 'react';
import { View, Text, StyleSheet } from 'react-native-web';
import FontAwesome from 'react-fontawesome';
import { Link } from './Link';

const News = ({ item }) => (
  <View style={styles.containerStyle}>
    <Text style={styles.titleStyle}>{item.title}</Text>
    <Text style={styles.siteNameStyle}>{item.name}</Text>
    <Link href={item.link} style={styles.linkStyle}>
      <FontAwesome name="external-link-alt" />
    </Link>
  </View>
);

const styles = StyleSheet.create({
  containerStyle: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  titleStyle: {
    fontWeight: 'bold',
  },
  linkStyle: {
    color: '#444',
    textAlign: 'right',
  },
  siteNameStyle: {
    color: '#999',
  },
});

export { News };
