import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const DetailScreen = ({ route, navigation}) => {
  const { item } = route.params;

  const [items, setItems] = useState([]);

const loadItems = async () => {
  try {
    const storedItems = await AsyncStorage.getItem('items');
    if (storedItems !== null) {
      setItems(JSON.parse(storedItems));
    }
  } catch (error) {
    console.error('Error loading items:', error);
  }
};

useEffect(() => {
  loadItems();
}, []);

const handleFirst = () => {
  if (items.length > 0) {
    navigation.navigate('Detail', { item: items[0] });
  }
};

const handlePrevious = () => {
  const currentIndex = items.findIndex(student => student.id === item.id);
  if (currentIndex > 0) {
    navigation.navigate('Detail', { item: items[currentIndex - 1] });
  }
};

const handleNext = () => {
  const currentIndex = items.findIndex(student => student.id === item.id);
  if (currentIndex < items.length - 1) {
    navigation.navigate('Detail', { item: items[currentIndex + 1] });
  }
};

const handleLast = () => {
  if (items.length > 0) {
    navigation.navigate('Detail', { item: items[items.length - 1] });
  }
};

const saveItems = async (newItems) => {
  try {
    await AsyncStorage.setItem('items', JSON.stringify(newItems));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

const handleDelete = (delItem) => {
  Alert.alert(
    'Confirm Deletion',
    `Are you sure you want to remove ${delItem.itemName}?`,
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          const updatedItems = items.filter((item) => item.id !== delItem.id);
          setItems(updatedItems);
          saveItems(updatedItems);
          navigation.goBack();
        },
        style: 'destructive',
      },
    ],
    { cancelable: true }
  );
};

  

  return (
    <View style={styles.container}>
      <View style={styles.studentInfo}>
        <View style={styles.imgContainer}>
        <Image source={{ uri: item.file }} style={styles.profileImage}
            />
        </View>
        <Text style={styles.heading}>{item.itemName}</Text>
        <View style={styles.infoWrap}>
          <View style={styles.singleInfo}>
            <Text style={styles.label}>Category: <Text style={styles.info}>{item.category}</Text></Text>
          </View>
      
        <Text style={styles.label}>Quantity: <Text style={styles.info}>{item.quantity}</Text></Text>
        </View>
      </View>

      <View style={styles.delWrap}>
      <TouchableOpacity onPress={() =>handleDelete(item)}>
        <Text style={styles.delText}>Delete</Text>
      </TouchableOpacity>
      </View>

      <View style={styles.navigationButtons}>
        <TouchableOpacity onPress={handleFirst}>
          <View style={styles.navItem}>
            {/* <Text style={styles.navigationText}>First</Text> */}
            <Ionicons name='play-back' size={18} color={'white'}/>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePrevious}>
        <View style={styles.navItem}>
          {/* <Text style={styles.navigationText}>Previous</Text> */}
          <Ionicons name='caret-back' size={18} color={'white'}/>
        </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNext}>
          <View style={styles.navItem}>
            {/* <Text style={styles.navigationText}>Next</Text> */}
            <Ionicons name='caret-forward' size={18} color={'white'}/>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLast}>
         <View style={styles.navItem}>
          {/* <Text style={styles.navigationText}>Last</Text> */}
          <Ionicons name='play-forward' size={18} color={'white'}/>
          </View>
        </TouchableOpacity>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9F9F9', // Light background color
  },
  studentInfo: {
    backgroundColor: '#fff',
    marginTop: 40,
    height: 300,
    padding: 20

  },
  imgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, // Add some space between the image and text
  },
  flagImage: {
    width: 70,
    height: 70,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold', // Make the labels bold
    marginBottom: 8,
    marginTop: 20
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'normal'
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  infoWrap: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 'auto'
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 16,
  },
  navigationText: {
    fontSize: 16,
    color: '#fff', // Blue color
    fontWeight: 'bold',
  },
  navItem: {
    backgroundColor: '#000',
    padding: 5,
    borderRadius: 5,
    marginLeft: 10
  },
  delWrap: {
    display: 'flex',
    alignItems: 'center',
    margin: 20
  },
  delText: {
    color: 'red',
    fontWeight: 'bold'
  }
});

export default DetailScreen;
