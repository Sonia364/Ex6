import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

const AddItem = ({ navigation, route }) => {
  const { item } = route.params || {};
  const isEditMode = !!item;

  const [itemName, setItemName] = useState(item?.itemName || '');
  const [category, setCategory] = useState(item?.category || '');
  const [quantity, setQuantity] = useState(item?.quantity ? item.quantity.toString() : '');
  const [file, setFile] = useState(item?.file ? item.file : '');
  const [error, setError] = useState(null); 
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const storedCategories = await AsyncStorage.getItem('categories');
        if (storedCategories) {
          setCategories(JSON.parse(storedCategories));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

const pickImage = async () => { 
  const { status } = await ImagePicker. 
      requestMediaLibraryPermissionsAsync(); 

  if (status !== "granted") { 

      // If permission is denied, show an alert 
      Alert.alert( 
          "Permission Denied", 
          `Sorry, we need camera  
           roll permission to upload images.` 
      ); 
  } else { 

      const result = 
          await ImagePicker.launchImageLibraryAsync(); 
      if (!result.canceled) { 
        if (result.assets.length > 0 && !result.cancelled) {
          setFile(result.assets[0].uri);
          setError(null);
        }
      } 
  } 
}; 

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
              file: file
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
          file: file
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
              placeholder="Quantity"
              value={quantity}
              onChangeText={text => setQuantity(text)}
              keyboardType="numeric" // Set keyboard type to numeric
          />
          <View style={styles.imageWrap}>
            <Text style={styles.header}> 
                Add Image: 
            </Text> 
            <TouchableOpacity style={styles.button} 
                onPress={pickImage}> 
                <Text style={styles.buttonText}> 
                    Choose Image 
                </Text> 
            </TouchableOpacity> 
            {file ? ( 
                // Display the selected image 
                <View style={styles.imageContainer}> 
                    <Image source={{ uri: file }} 
                        style={styles.image} /> 
                </View> 
            ) : ( 
                <Text style={styles.errorText}>{error}</Text> 
            )} 
            </View>
            <View style={styles.pickerView}>
              <Picker
            selectedValue={category}
            onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
          >
            <Picker.Item label="Select a category" value="" />
            {categories.map((cat, index) => (
              <Picker.Item label={cat.name} value={cat.name} key={index} />
            ))}
          </Picker>
          </View>
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
  imageWrap: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#d7d7d7',
    marginBottom: 20
  },

header: { 
    fontSize: 16, 
    color: 'grey',
    fontWeight: 'bold',
    marginBottom: 16, 
}, 
button: { 
    backgroundColor: "#007AFF", 
    width: 150,
    padding: 10, 
    borderRadius: 8, 
    marginBottom: 16, 
    shadowColor: "#000000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.4, 
    shadowRadius: 4, 
    elevation: 5, 
}, 
buttonText: { 
    color: "#FFFFFF", 
    fontSize: 16, 
    fontWeight: "bold", 
}, 
imageContainer: { 
    borderRadius: 8, 
    marginBottom: 16, 
    shadowColor: "#000000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.4, 
    shadowRadius: 4, 
    elevation: 5, 
}, 
image: { 
    width: 100, 
    height: 100, 
    borderRadius: 5, 
}, 
errorText: { 
    color: "red", 
    marginTop: 16, 
}, 
pickerView: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  marginBottom: 10,
  overflow: 'hidden',
},
picker: {
  height: 40,
  width: '100%',
  color: '#333', // Adjust text color
}
});

export default AddItem;
