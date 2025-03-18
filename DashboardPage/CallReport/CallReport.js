import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CallReport = ({ navigation }) => {
  const [tab, setTab] = useState('Call Task');
  const [todayTasks, setTodayTasks] = useState([]);
  const [allTasks, setAllTasks] = useState(0);
  const [todayRemaining, setTodayRemining] = useState([]);
  const [remainingTask, setRemainingTask] = useState([]);
  const [todayPending, setTodayPending] = useState(0);
  const [pendingTask, setPendingTask] = useState(0);
  const [todayCompleted, setTodayCompleted] = useState(0);
  const [completedTask, setCompletedTask] = useState(0);
  const [todayRemainder, setTodayRemainder] = useState(0);
  const [remainderList, setRemainderList] = useState([]);
  const [completedTaskByDay, setCompletedTaskByDay] = useState([]);
  const [loading, setLoading] = useState(true);

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
  
      const response = await fetch('https://staff.annaianbalayaa.org/public/api/callreport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userData.user_id }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Fetched Data:', result);
  
      
      if (result) {
        const formattedData = Object.keys(result).map((date) => ({
          date: date,
          complete: result[date].complete,
          newtask: result[date].newtask,
          pending: result[date].pending,
          reminder: result[date].reminder,
        }));
        setCompletedTaskByDay(formattedData);
      } else {
        setCompletedTaskByDay([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid Date';
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  };

  

  return (
    <View style={styles.container}>
      {/* Call Duty Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailBox}>
          <Image source={require('../TeamReport/customer-service.png')} style={styles.largeIcon} />
          <Text style={styles.detailText}>{allTasks}</Text>
          <Text style={styles.detailSubText}>Total Task</Text>
        </View>
        <View style={styles.detailBox}>
          <Image source={require('../TeamReport/check-mark.png')} style={styles.largeIcon} />
          <Text style={styles.detailText}>{completedTask}</Text>
          <Text style={styles.detailSubTextcomplete}>Complete</Text>
        </View>
        <View style={styles.detailBox}>
          <Image source={require('../TeamReport/cross.png')} style={styles.largeIcon} />
          <Text style={styles.detailText}>{pendingTask}</Text>
          <Text style={styles.detailSubTextpending}>Pending</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, tab === 'Call Task' && styles.activeTab]}
          onPress={() => setTab('Call Task')}
        >
          <Text style={tab === 'Call Task' ? styles.activeTabText : styles.tabText}>
            Call History
          </Text>
        </TouchableOpacity>
      </View>

      
      <View style={styles.container}>
      {/* Table Header */}
      <View style={[styles.row, styles.headerRow]}>
  <Text style={[styles.cell, styles.headerCell]}>S.No</Text>
  <Text style={[styles.cell, styles.headerCell]}>Date</Text>
  <Text style={[styles.cell, styles.headerCell]}>Completed Count</Text>
</View>

      {/* Table Data */}
      <FlatList
    data={completedTaskByDay}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item, index }) =>  (
    <TouchableOpacity
  onPress={() => navigation.navigate('CallReportDetails', {
    date: item.date,
    complete: item.complete,
    newtask: item.newtask,
    pending: item.pending,
    reminder: item.reminder
  })}
>
  <View style={styles.row}>
  <Text style={styles.cell}>{index + 1}</Text>
    <Text style={styles.cell}>{formatDate(item.date)}</Text>
    <Text style={styles.cell}>{item.complete}</Text>
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
  largeIcon: { width: 30, height: 30 },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  detailBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
  },
  detailText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  detailSubText: { fontSize: 14, color: '#4F46E5', textAlign: 'center', fontWeight: 'bold' },
  detailSubTextcomplete: { fontSize: 14, color: '#008000', textAlign: 'center', fontWeight: 'bold' },
  detailSubTextpending: { fontSize: 14, color: '#ff0000', textAlign: 'center', fontWeight: 'bold' },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: { flex: 1, padding: 10, alignItems: 'center' },
  activeTab: { borderBottomWidth: 3, borderBottomColor: '#5a4ccf' },
  tabText: { fontSize: 16, color: '#555' },
  activeTabText: { fontSize: 16, color: '#5a4ccf', fontWeight: 'bold' },
  table: { marginTop: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerRow: { backgroundColor: '#E0E7FF' },
  cell: { flex: 1, textAlign: 'center', padding: 8, color: '#111827' },
  headerCell: { fontWeight: 'bold' },
});

export default CallReport;
