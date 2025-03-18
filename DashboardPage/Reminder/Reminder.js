import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CallDuty = () => {
  const navigation = useNavigation();
  const [tab, setTab] = useState('Call Task');
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  
 
  const [userData, setUserData] = useState(null);

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

  useEffect(() => {
    if (userData) {
      const fetchData = async () => {
        try {
          const response = await fetch(`https://staff.annaianbalayaa.org/public/api/remainder`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: userData.user_id, 
            }),
          });

          const data = await response.json();
          setData(data);
        } catch (error) {
          console.error('Error fetching API data:', error);
        }
      };

      fetchData(); 
    }
  }, [userData]);

  const filterData = (data, searchText) => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.filter((item) => {
      const name = item?.name?.toLowerCase() || '';
      const mobile = item?.mobile?.toLowerCase() || '';
      return (
        name.includes(searchText.toLowerCase()) ||
        mobile.includes(searchText.toLowerCase())
      );
    });
  };

  const handleTaskPress = (taskId, taskDetails) => {
    navigation.navigate('CallActivity', { id: taskId, details: taskDetails });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  };

  const maskMobile = (mobile) => {
    if (!mobile) return 'N/A'; // Handle null or undefined cases
    
    return `${mobile.slice(0, 2)}${'X'.repeat(mobile.length - 4)}${mobile.slice(-2)}`;
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
      <TextInput
  style={styles.searchBar}
  placeholder="Search by Name or Mobile"
  placeholderTextColor="grey"
  value={searchText}
  onChangeText={(text) => setSearchText(text)} 
/>
        
      </View>

      <FlatList
  data={filterData(data, searchText)}
  keyExtractor={(item, index) => item.id?.toString() || index.toString()}
  renderItem={({ item }) => (
    <TouchableOpacity onPress={() => handleTaskPress(item.id, item)}>
      <View style={styles.taskItem}>
          <Image source={require('../Reminder/user(2).png')} style={styles.largeIcon} />
          <View style={styles.textContainer}>
            <Text style={styles.taskText}>{item.name} - {maskMobile(item.mobile)}</Text>
            <Text style={styles.taskText1}>{formatDateTime(item.updated_at)}</Text>
            <Text style={styles.taskText2}>Status: {item.status ? item.status : 'N/A'}</Text>
            <Text style={styles.taskText3}>Notes: {item.notes ? item.notes : 'N/A'}</Text>

          </View>
        </View>
    </TouchableOpacity>
  )}
/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#5a4ccf',
  },
  tabText: { fontSize: 15, color: '#555' },
  activeTabText: { fontSize: 16, color: '#5a4ccf', fontWeight: 'bold' },
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
  sortingContainer: {
    justifyContent: 'center',   
    alignItems: 'center',          
  },
  sortButton: {
    paddingVertical: 6,           
    paddingHorizontal: 12,        
    backgroundColor: '#4F46E5',   
    borderRadius: 5,               
  },
  sortButtonText: {
    color: '#fff',                
    fontSize: 14,                  
    fontWeight: 'bold',            
  },
  largeIcon: {
    width: 40,
    height: 40,
    marginBottom: 10, 
  },
  taskItem: {
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginLeft:10,
    marginRight:10,
    margin: 2,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  textContainer: {
    flex: 1, 
    flexDirection: 'column', 
    marginLeft: 10,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 5,
  },
  taskText1: {
    fontSize: 14,
    color: '#666', 
    marginTop: 5, 
    marginLeft: 5,
  },
  taskText2: {
    fontSize: 14,
    color: '#008000',
    marginTop: 5,
    marginLeft: 5,
  },taskText3: {
    fontSize: 14,
    color: '#4F46E5', 
    marginTop: 5,
    marginLeft: 5,
  },
  taskText4:{
    fontSize: 14,
    color: '#4F46E5',
    marginTop: 5,
    marginLeft:5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 100, 
    height: 100, 
    marginBottom: 20, 
  },
});

export default CallDuty;
