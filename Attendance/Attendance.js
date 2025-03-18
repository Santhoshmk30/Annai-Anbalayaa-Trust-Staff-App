import React, { useState,useEffect} from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const Attendance = () => {
  const navigation = useNavigation(); 
  const [tab, setTab] = useState('Call Task');
  const [presentcount, setPresentcount] = useState(0);
  const [absentcount, setAbsentcount] = useState([]);
  const [loginhistory, setLoginHistory] = useState([]);

  const handleTaskPress = (item) => {
    // Retrieve user_id from AsyncStorage
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
  
    
      navigation.navigate('AttendanceDetails', {
        user_id: userData.user_id,
        date: item.date, 
      });
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid Date';
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  };
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
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
  
      const response = await fetch('https://staff.annaianbalayaa.org/public/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userData.user_id }),
      });
  
      console.log('Response Status:', response.status); // HTTP status code check
      console.log('Response OK:', response.ok); // Response is successful or not
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Fetched Data:', result); // API response check
  
      
      setPresentcount(result.present_count || 0);
      setAbsentcount(result.absent_count || 0);
      setLoginHistory(result.login_histories|| []);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      {/* Call Duty Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailBox}>
          <Image
            source={require('../CallDuty/check-mark.png')}
            style={styles.largeIcon}
          />
          <Text style={styles.detailText}>{presentcount}</Text>
          <Text style={styles.detailSubTextcomplete}>Present</Text>
        </View>
        <View style={styles.detailBox}>
          <Image
            source={require('../CallDuty/cross.png')}
            style={styles.largeIcon}
          />
          <Text style={styles.detailText}>{absentcount}</Text>
          <Text style={styles.detailSubTextpending}>Absent</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <View
          style={[styles.tab, tab === 'Call Task' && styles.activeTab]}
          onPress={() => setTab('Call Task')}
        >
          <Text style={tab === 'Call Task' ? styles.activeTabText : styles.tabText}>
            Attendence Details
          </Text>
        </View>
      </View>


      <View style={styles.container}>

      <View style={[styles.row, styles.headerRow]}>
        <Text style={[styles.cell, styles.headerCell]}>Date</Text>
        <Text style={[styles.cell, styles.headerCell]}>Working Hours</Text>
      </View>

      {/* Task List */}
      <FlatList
        data={loginhistory}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleTaskPress(item)}>
            <View style={styles.row}>
            <Text style={styles.cell}>{formatDate(item.date)}</Text>
            <Text style={styles.cell}>{item.total_hours ? item.total_hours : '-'}</Text>
          </View>
          </TouchableOpacity>
        )}
      />
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#5a4ccf',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  headerText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  icon: { width: 20, height: 20 },
  largeIcon: { width: 30, height: 30 },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 20,
    
  },
  detailBox: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    elevation: 5, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
    width: '40%', 
    height: 110,  
  },
  
  detailText: { fontSize: 20, fontWeight: 'bold', marginVertical: 5 },
  detailSubTextcomplete:{
    fontSize: 14,
    color: '#008000',
    textAlign: 'center',
    fontWeight:'bold',},
  detailSubTextpending:{
    fontSize: 14,
    color: '#ff0000',
    textAlign: 'center',
    fontWeight:'bold',
  },
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
  tabText: { fontSize: 16, color: '#555' },
  activeTabText: { fontSize: 16, color: '#5a4ccf', fontWeight: 'bold' },
  searchBar: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    margin: 2,
    borderRadius: 8,
    elevation: 5, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
  },
  taskText: { marginLeft: 10, fontSize: 16, color: '#333' },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerRow: { backgroundColor: '#E0E7FF' },
  cell: { flex: 1, textAlign: 'center', padding: 8, color: '#111827' },
  headerCell: { fontWeight: 'bold' },
});

export default Attendance;