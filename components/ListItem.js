import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Svg, { Image } from 'react-native-svg';

const ListItem = ({ item, deleteItem, handleEditBtnPress }) => {
  const navigation = useNavigation();

  const handleItemPress = (item) => {
    navigation.navigate('Detail', { item });
  };

  return (
    <TouchableOpacity style={styles.listItem} onPress={() => handleItemPress(item)}>
      <View style={styles.listItemView}>
        <View style={styles.textView}>
        <Text style={styles.listItemText}>{item.firstName}</Text>
        </View>
        <View style={styles.icons}>
          <Icon name="pencil" size={20} color='#007BFF' onPress={() => handleEditBtnPress(item.id, item.text)} />
          <Icon name="remove" size={20} color='firebrick' onPress={() => deleteItem(item.id)} style={{marginLeft: 10}}/>
        </View>
      </View>
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  listItem: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  listItemView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  editView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    padding: 8,
  },
  textView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  listItemText: {
    fontSize: 18,
    marginLeft: 10,
  },
  icons: {
    flexDirection: 'row',
  },
});

export default ListItem;
