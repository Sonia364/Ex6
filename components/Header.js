import React from "react";
import {View, Text, StyleSheet} from 'react-native';

const Header = ({title}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.text}>
        {title}
      </Text>
    </View>

  )
};

Header.defaultProps = {
    title: 'Inventory List'
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    padding: 20,
    backgroundColor: '#734F6B'
  },
  text: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  }

});

export default Header;