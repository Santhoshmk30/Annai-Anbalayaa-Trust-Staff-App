import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, TextInput,Image,ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const Completedcalls = () => {
  const navigation = useNavigation(); 
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [date, setDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
  
      const userDataString = await AsyncStorage.getItem('userData');
      if (!userDataString) {
        Alert.alert('Error', 'User ID not found! Redirecting to login.');
        return;
      }
  
      const userData = JSON.parse(userDataString);
      if (!userData?.user_id) {
        Alert.alert('Error', 'User ID is missing! Redirecting to login.');
        return;
      }
  
      const response = await fetch('https://staff.annaianbalayaa.org/public/api/complete_list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userData.user_id }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Fetched Data:', result);
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleTaskPress = (item) => {
    AsyncStorage.getItem('userData').then((userDataString) => {
      if (!userDataString) {
        Alert.alert('Error', 'User ID not found!');
        return;
      }
  
      const userData = JSON.parse(userDataString);
      if (!userData?.user_id) {
        Alert.alert('Error', 'User ID is missing!');
        return;
      }
  
      navigation.navigate('CompletedcallsDetails', {
        user_id: userData.user_id,
        date: item.date, 
      });
    });
  };

  const fetchFilteredData = async (search, selectedDate) => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (!userDataString) {
        Alert.alert('Error', 'User ID not found! Redirecting to login.');
        return;
      }
  
      const userData = JSON.parse(userDataString);
      if (!userData?.user_id) {
        Alert.alert('Error', 'User ID is missing! Redirecting to login.');
        return;
      }
  
      // Prepare request body
      const requestBody = { id: userData.user_id };
      if (search) requestBody.search = search;
      if (selectedDate) requestBody.date = selectedDate;
  
      const response = await fetch('https://staff.annaianbalayaa.org/public/api/complete_list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      setData(result); 
    } catch (error) {
      console.error('Error fetching filtered data:', error);
      Alert.alert('Error', 'Failed to fetch filtered data. Please try again.');
    }
  };
  


  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid Date';
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  };

  const handleConfirm = (selectedDate) => {
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); 
    const year = selectedDate.getFullYear();
  
    const formattedDate = `${day}-${month}-${year}`;
    setDate(formattedDate);
    setDatePickerVisibility(false);
    
    fetchFilteredData(searchText, formattedDate);
  };


  const handleReload = () => {
    navigation.replace('Completedcalls');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Image 
          source={require('../trust-logo.png')} 
          style={styles.logo} 
        />
        <ActivityIndicator size="large" color="#5a4ccf" />
        
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      
<View style={styles.headerContainer}>
<TextInput
  style={styles.searchBar}
  placeholder="Search by Name or Mobile"
  placeholderTextColor="grey"
  value={searchText}
  onChangeText={(text) => {
    setSearchText(text);
    fetchFilteredData(text, date);
  }} 
/>
<TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
  <Image source={require('../Icons/calendar.png')} style={styles.icon} />
</TouchableOpacity>
<DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={() => setDatePickerVisibility(false)}
          />
           <TouchableOpacity style={styles.refreshButton} onPress={handleReload} >
<Text style={styles.refreshButtonText}>Refresh</Text>
    </TouchableOpacity>
      </View>

     

      {(searchText === '' && date === '') || data.length > 0 ? (
  <View style={styles.tableContainer}>
    <View style={[styles.row, styles.headerRow]}>
      <Text style={[styles.cell, styles.headerCell]}>Date</Text>
      <Text style={[styles.cell, styles.headerCell]}>Completed Calls</Text>
    </View>

    <FlatList
      data={sortedData || []} 
      keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handleTaskPress(item)}>
          <View style={styles.row}>
            <Text style={styles.cell}>{formatDate(item?.date || "N/A")}</Text>
            <Text style={styles.cell}>{item?.count || "0"}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  </View>
) : null} 
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 10 },
  tabContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ddd' },
  activeTab: { flex: 1, padding: 10, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: '#5a4ccf' },
  activeTabText: { fontSize: 16, color: '#5a4ccf', fontWeight: 'bold' },
  tableContainer: { marginTop: 10 },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerRow: { backgroundColor: '#E0E7FF' },
  cell: { flex: 1, textAlign: 'center', padding: 18, color: '#111827' },
  headerCell: { fontWeight: 'bold' },
  icon: {
    width: 60, 
    height: 30,
    resizeMode: 'contain',
  },
  headerContainer: {
    flexDirection: 'row',  
    alignItems: 'center',         
    justifyContent: 'space-between',
    padding: 10,                   
    backgroundColor: '#f8f8f8',    
  },
  searchBar: {
    flex: 1,                      
    padding: 8,                    
    borderWidth: 1,                
    borderColor: '#4F46E5',         
    borderRadius: 5,              
    backgroundColor: '#fff',       
    marginRight: 10,                
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Optional: set a background color
  },
  logo: {
    width: 100, // Adjust to your logo size
    height: 100, // Adjust to your logo size
    marginBottom: 20, // Space between the logo and the spinner
  },
  refreshButton: {
    paddingVertical: 6,           
    paddingHorizontal: 10, 
    width:70,
    height:30,     
    backgroundColor: '#4F46E5',   
    borderRadius: 5,               
  },
  refreshButtonText: {
    color: '#fff',                
    fontSize: 14,                  
    fontWeight: 'bold',            
  },
});

export default Completedcalls;
