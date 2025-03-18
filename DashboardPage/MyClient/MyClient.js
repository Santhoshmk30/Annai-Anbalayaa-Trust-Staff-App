import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyClient = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
  
     
      const userDataString = await AsyncStorage.getItem('userData');
      console.log('Stored UserData:', userDataString);
  
      if (!userDataString) {
        Alert.alert('Error', 'User data not found! Redirecting to login.');
        setLoading(false);
        return;
      }
  
      const userData = JSON.parse(userDataString);
      console.log('Parsed UserData:', userData);
  
      if (!userData?.user_id) {
        Alert.alert('Error', 'User ID is missing! Redirecting to login.');
        setLoading(false);
        return;
      }
  
      console.log('Sending User ID:', userData.user_id);
      const response = await fetch(`https://staff.annaianbalayaa.org/public/api/myclientlist?id=${userData.user_id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      console.log('Response Status:', response.status);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Fetched Data:', result);
  
      if (!result || result.length === 0) {
        Alert.alert('No Data', 'No client data found.');
      }
  
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      Alert.alert('Error', 'Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Client Details</Text>


      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>S.no</Text>
        <Text style={styles.tableHeaderText}>Name</Text>
        <Text style={styles.tableHeaderText}>Mobile no</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{index + 1}</Text>
            <Text style={styles.tableCell}>{item.name}</Text>
            <Text style={styles.tableCell}>{item.mobile}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    padding: 10,
    marginTop: 10,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 10,
  },
  tableCell: {
    flex: 1,
  },
});

export default MyClient;
