import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddClient = () => {
  const [userData, setUserData] = useState(null); 
  const [clientData, setClientData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    pincode: '',
    aadhaar: '',
  });

  useEffect(() => {
    const fetchSavedData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('userData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setUserData(parsedData); 
        } else {
          console.log('No data found.');
        }
      } catch (error) {
        console.error('Error fetching saved data:', error);
      }
    };

    fetchSavedData();
  }, []);

  const handleChange = (key, value) => {
    setClientData({ ...clientData, [key]: value });
  };

  const handleSubmit = async () => {
    if (!userData || !userData.user_id) {
      Alert.alert('Error', 'User ID not found.');
      return;
    }
  
   
    for (const key in clientData) {
      if (clientData[key].trim() === '') {
        Alert.alert('Error', `Please enter ${key.replace('_', ' ')}.`);
        return;
      }
    }
  
    try {
      const response = await fetch('https://staff.annaianbalayaa.org/public/api/myclient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userData.user_id, 
          ...clientData,
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        console.log('Client added successfully:', result);
        Alert.alert('Success', 'Client added successfully!');
        setClientData({
          name: '',
          email: '',
          mobile: '',
          address: '',
          pincode: '',
          aadhaar: '',
        });
      } else {
        console.error('Failed to add client:', result);
        Alert.alert('Error', 'Failed to add client. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong. Please check your internet connection.');
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Client Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Client Name"
          value={clientData.name}
          onChangeText={(text) => handleChange('name', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Client Email ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Client Email"
          value={clientData.email}
          onChangeText={(text) => handleChange('email', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Client Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Phone Number"
          keyboardType="phone-pad"
          value={clientData.mobile}
          onChangeText={(text) => handleChange('mobile', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Client Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Address"
          value={clientData.address}
          onChangeText={(text) => handleChange('address', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Client Pincode</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Pincode"
          keyboardType="numeric"
          value={clientData.pincode}
          onChangeText={(text) => handleChange('pincode', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Client Aadhaar No</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Aadhaar No"
          keyboardType="numeric"
          value={clientData.aadhaar}
          onChangeText={(text) => handleChange('aadhaar', text)}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add Client</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  button: {
    backgroundColor: '#4F46E5',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddClient;
