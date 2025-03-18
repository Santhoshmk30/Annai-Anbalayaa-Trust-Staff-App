import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Modal,
  FlatList,
  Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { SelectList } from 'react-native-dropdown-select-list';

const CallActivityHistory = ({ route }) => {
  const { id, details } = route.params; 
  const [amount, setAmount] = useState('');
  const [transactionNo, setTransactionNo] = useState('');
  const [notes, setNotes] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState('');
  const [dept, setDept] = useState('');
  const [filteredHistory, setFilteredHistory] = useState([]); // Add state for filtered history

  const data = [
    { key: '1', value: 'Option 1' },
    { key: '2', value: 'Option 2' },
    { key: '3', value: 'Option 3' },
    { key: '4', value: 'Option 4' },
  ];

  const historyData = [
    { id: '1', dateTime: '2024-11-17 20:14:13', status: 'Completed', notes: 'Payment confirmed' },
    { id: '2', dateTime: '2024-11-16 15:10:00', status: 'Pending', notes: 'Waiting for confirmation' },
    { id: '3', dateTime: '2024-11-15 10:30:45', status: 'Completed', notes: 'Payment successful' },
  ];

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
    if (details?.id) {
      fetchHistoryData(details.id);
    }
  }, [details]);

  const fetchHistoryData = async () => {
    try {
      const response = await fetch('https://staff.annaianbalayaa.org/public/api/call_history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }), // Use details.id here
      });
  
      const text = await response.text();
      console.log('Raw response:', text);
  
      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        return;
      }
  
      // Parse JSON data
      const data = JSON.parse(text);
      console.log('Parsed data:', data);
  
      setFilteredHistory(data); // Set the fetched data
    } catch (error) {
      console.error('Error fetching history data:', error);
    }
  };
  
  
  
 

  const handleHistoryClick = () => {
    setModalVisible(true);
  };


  const handleCall = (phoneNumber) => {
    if (!phoneNumber) return;
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch((err) => console.error('Failed to open dial pad', err));
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    return `${day}-${month}-${year} ${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.activityContainer}>
        <Text style={styles.activityTitle}>Call Activity</Text>
        <View style={styles.table}>

          <View style={styles.row}>
            <Text style={styles.cellTitle}>Name</Text>
            <Text style={styles.cellValue}>{details.name || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>Mobile No</Text>
            <Text style={styles.cellValue}>{details.mobile || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>Last Update</Text>
            <Text style={styles.cellValue}>{formatDateTime(details.updated_at) || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cellTitle}>Status</Text>
            <TouchableOpacity onPress={handleHistoryClick}>
              <Text style={styles.linkText}>History</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.iconRow}>
        <TouchableOpacity
          onPress={() => handleCall(details.mobile)}
          accessible={true}
          accessibilityLabel="Call user"
        >
          <Image
            source={require('../CallActivity/phone-call.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
      {userData?.dept !== 'TELECALLER' && (
  <View style={styles.inputRow}>
    <TextInput
      style={[styles.input, { flex: 1, marginRight: 5 }]}
      placeholder="Amount"
      placeholderTextColor="#888888"
      keyboardType="numeric"
      value={amount}
      onChangeText={setAmount}
    />
    <TextInput
      style={[styles.input, { flex: 1, marginLeft: 5 }]}
      placeholder="Transaction No"
      placeholderTextColor="#888888"
      value={transactionNo}
      onChangeText={setTransactionNo}
    />
  </View>
)}

  <View style={styles.dropdowncontainer}>
    <SelectList
      setSelected={(val) => setSelected(val)}
      data={data}
      save="value"
      placeholder="Status"
      placeholderTextColor="#888888"
    />
  </View>

  <TextInput
    style={styles.input1}
    placeholder="Notes"
    placeholderTextColor="#888888"
    multiline
    value={notes}
    onChangeText={setNotes}
  />
</View>


      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>SAVE</Text>
      </TouchableOpacity>

      <Modal
  transparent={true}
  visible={modalVisible}
  animationType="slide"
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Call History</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderCell}>S.No</Text>
        <Text style={styles.tableHeaderCell}>Date & Time</Text>
        <Text style={styles.tableHeaderCell}>Status</Text>
        <Text style={styles.tableHeaderCell}>Notes</Text>
      </View>
      <FlatList
  data={filteredHistory} // Display filtered history
  keyExtractor={(item) => item.id.toString()} // Ensure the key is a string
  renderItem={({ item, index }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{index + 1}</Text>
      <Text style={styles.tableCell}>
        {typeof formatDateTime(item.updated_at) === 'string' 
          ? formatDateTime(item.updated_at) 
          : 'Invalid Date'}
      </Text>
      <Text style={styles.tableCell}>{item.status ? item.status : '-'}</Text>
      <Text style={styles.tableCell}>{item.notes ? item.notes : '-'}</Text>
    </View>
  )}
/>



      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setModalVisible(false)}
      >
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#5a4ccf',
    padding: 15,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activityContainer: {
    margin: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
  },
  activityTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  table: { marginTop: 10 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  cellTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cellValue: { fontSize: 16, color: '#666' },
  linkText: { fontSize: 16, color: '#5a4ccf' },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
  },
  icon: {
    width: 50,
    height: 50,
  },
  formContainer: {
    padding: 10,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#888888',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  input1: {
    borderWidth: 1,
    borderColor: '#888888',
    padding: 10,
    borderRadius: 5,
    marginTop:20,
    marginBottom: 10,
  },
  dropdowncontainer: {
    justifyContent: "center",
    paddingHorizontal: 20,
    width:400,
  
  },
  saveButton: {
    backgroundColor: '#5a4ccf',
    padding: 15,
    alignItems: 'center',
    margin: 20,
    borderRadius: 8,
  },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#4F46E5',
    padding: 10,
    marginTop: 20,
    alignItems: 'center',
    borderRadius: 8,
    
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CallActivityHistory;
