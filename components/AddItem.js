import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const AddItem = ({ navigation, route }) => {
  const { item } = route.params || {};
  const isEditMode = !!item;

  const [itemName, setItemName] = useState(item?.itemName || '');
  const [category, setCategory] = useState(item?.category || '');
  const [quantity, setQuantity] = useState(item?.quantity ? item.quantity.toString() : '');

  const handleAddItem = async () => {
    if (!itemName || !category || !quantity) {
      Alert.alert('Error', 'Please fill out all fields before adding an item.');
      return;
    }

    try {
      const existingItems = await AsyncStorage.getItem('items');
      const items = existingItems ? JSON.parse(existingItems) : [];

      if (isEditMode) {
        // If in edit mode, update the existing item
        const updatedItems = items.map((i) => {
          if (i.id === item.id) {
            return {
              ...i,
              itemName,
              category,
              quantity: parseInt(quantity),
            };
          }
          return i;
        });
        await AsyncStorage.setItem('items', JSON.stringify(updatedItems));
      } else {
        // If not in edit mode, add a new item
        const newItem = {
          id: Crypto.randomUUID(),
          itemName: itemName,
          category: category,
          quantity: parseInt(quantity),
        };
        items.push(newItem);
        await AsyncStorage.setItem('items', JSON.stringify(items));
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error adding/updating item:', error);
    }
  };

  return (
    <View style={styles.container}>
          <TextInput
              style={styles.input}
              placeholder="Item Name"
              value={itemName}
              onChangeText={text => setItemName(text)}
          />
          <TextInput
              style={styles.input}
              placeholder="Category"
              value={category}
              onChangeText={text => setCategory(text)}
          />
          <TextInput
              style={styles.input}
              placeholder="Quantity"
              value={quantity}
              onChangeText={text => setQuantity(text)}
              keyboardType="numeric" // Set keyboard type to numeric
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
              <Text style={styles.buttonText}>{isEditMode ? 'Save Changes' : 'Add Item'}</Text>
          </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    position: 'relative'
  },
  input: {
    height: 40,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  addButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddItem;
