import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, Alert, TextInput} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';

const HomeScreen = ({navigation}) => {

  const openedRow = useRef();
  const [items, setItems] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const lastNameIcon = sortOrder === 'asc' ? 'sort-alpha-down' : 'sort-alpha-up';
  const gpaIcon = sortOrder === 'asc' ? 'sort-numeric-down' : 'sort-numeric-up';

  useEffect(() => {
    // Load users from AsyncStorage when component mounts
    loadItems();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // This function will be called whenever the screen comes into focus
      loadItems();
    }, [])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ marginRight: 16, flexDirection: 'row' }}>
           <TouchableOpacity onPress={handleSortByLastName}>
                <FontAwesome5 name={lastNameIcon} size={24} color="black" style={{ marginRight: 16 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSortByGpa}>
                <FontAwesome5 name={gpaIcon} size={24} color="black" />
            </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const loadItems = async () => {
    try {
      const storedItems = await AsyncStorage.getItem('items');
      if (storedItems !== null) {
        setItems(JSON.parse(storedItems));
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const saveItems = async (newItems) => {
    try {
      await AsyncStorage.setItem('items', JSON.stringify(newItems));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.id.toLowerCase().includes(searchQuery.toLowerCase())||
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  }

  const handleSortByLastName = () => {
    setSortBy('lastName');
    toggleSortOrder(); // Add this line
  };

  const handleSortByGpa = () => {
    setSortBy('gpa');
    toggleSortOrder(); // Add this line
  };

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'lastName') {
      return (sortOrder === 'asc' ? 1 : -1) * a.lastName.localeCompare(b.lastName);
    } else if (sortBy === 'gpa') {
      return (sortOrder === 'asc' ? 1 : -1) * (b.gpa - a.gpa); // Sort in descending order by GPA
    }
    return 0;
  });

  const handleEdit = (item) => {
    // Navigate to EditUser component with user data
    navigation.navigate('AddItem', {item : item});
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
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const handleStudentPress = (item) => {
    navigation.navigate('Detail', 
    { 
      item: item
    });
  };

  const renderItem = ({ item, index }) => (
    <Swipeable
      renderRightActions={( _, __, swipeable) => (
        <View style={styles.userSwipeItem}>
          <TouchableOpacity onPress={() => [handleEdit(item), swipeable.close()]}>
            <View style={styles.editBtn}>
            <Text style={styles.btnText}>Edit</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => [handleDelete(item), swipeable.close()]} >
            <View style={styles.deleteBtn}>
            <Text style={styles.btnText}>Delete</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      onSwipeableWillOpen={() => openedRow.current?.close()}
      onSwipeableOpen={(_, swipeable) => (openedRow.current = swipeable)}
      friction={1}
    >
    <TouchableOpacity onPress={() => handleStudentPress(item)}>
        <View style={styles.userItem}>
        <View style={styles.leftContent}>
        <Image source={{ uri: item.file }} style={styles.profileImage}
            />
        </View>
        <View style={styles.rightContent}>
            <Text style={styles.name}>{item.itemName}</Text>
            <Text style={styles.info}>Category: {item.category}</Text>
            <Text style={styles.info}>Quantity: {item.quantity}</Text>
        </View>
        </View>
    </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
        <TextInput
        style={styles.searchInput}
        placeholder="Search Item(s)"
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
        />
        <Ionicons 
        name="search-outline" 
        size={24} 
        color="#d3d3d3" 
        style={styles.searchIcon} 
        />
        <FlatList
        data={sortedItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  userSwipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editBtn: {
    backgroundColor: '#007BFF',
    padding: 20,
  },
  deleteBtn: {
    backgroundColor: '#FF4500',
    padding: 20,
  },
  btnText:{
    color: 'white',
    fontWeight: 'bold'
  },
  userItem: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f3f3'
  },
  leftContent: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
  },
  rightContent: {
    flex: 1,
    paddingTop: 10
  },
  name: {
    fontWeight: 'bold',
    color: 'gray',
  },
  info: {
    color: 'gray',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 5,
    justifyContent: 'flex-end'
  },
  searchInput: {
    height: 40,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 8
  },
  searchIcon: {
    position: 'absolute',
    top: 22,
    right: 20
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#000',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});

export default HomeScreen;
