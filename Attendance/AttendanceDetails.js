import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

const AttendanceDetails = ({ route }) => {
  const { user_id, date } = route.params;
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true); 
  

  useEffect(() => {
   
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch('https://staff.annaianbalayaa.org/public/api/attendence_date', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            user_id:user_id,
            date:date,
          }),
        });
    
        console.log('Response Status:', response.status); // HTTP status code check
        console.log('Response OK:', response.ok); // Response is successful or not
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const result = await response.json();
        console.log('Fetched Data:', result); // API response check

        setAttendanceData(result.data|| 0);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    

    fetchAttendanceData();
  }, [user_id, date]);
  


 
  return (
    <View style={styles.container}>
  <View style={styles.table}>
  
    <View style={[styles.row, styles.headerRow]}>
      <Text style={[styles.cell, styles.headerCell]}>S.No</Text>
      <Text style={[styles.cell, styles.headerCell]}>Check-In</Text>
      <Text style={[styles.cell, styles.headerCell]}>Check-Out</Text>
      <Text style={[styles.cell, styles.headerCell]}>Total Hours</Text>
    </View>

    
    <FlatList
      data={attendanceData}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => (
        <View style={styles.row}>
          <Text style={styles.cell}>{index + 1}</Text>
          <Text style={styles.cell}>{item.check_in_time}</Text>
          <Text style={styles.cell}>{item.check_out_time}</Text> 
          <Text style={styles.cell}>{item.total_usage || '-'}</Text> 
        </View>
      )}
    />
  </View>
</View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  table: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerRow: {
    backgroundColor: '#E0E7FF',
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    padding: 8,
    color: '#111827',
  },
  headerCell: {
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default AttendanceDetails;
