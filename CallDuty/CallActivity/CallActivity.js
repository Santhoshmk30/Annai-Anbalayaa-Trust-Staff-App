import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  ScrollView,Modal,FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SelectList } from 'react-native-dropdown-select-list';
import axios from 'axios';
import DateTimePickerModal from 'react-native-modal-datetime-picker';


const CallActivity = ({ route,navigation }) => {
  const { id, details = {} } = route.params || {}; // Default values
  const [amount, setAmount] = useState('');
  const [transactionNo, setTransactionNo] = useState('');
  const [specialdaymessage, setSpecialDayMessage] = useState('');
  const [notes, setNotes] = useState('');
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState(null);
  const [selectedSendReceipt, setSelectedSendReceipt] = useState(false);
  const [userData, setUserData] = useState(null);
  const [filteredHistory, setFilteredHistory] = useState([]); // Add state for filtered history
  const [date, setDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);


  useEffect(() => {
    const fetchSavedData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('userData');
        if (savedData) setUserData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error fetching saved data:', error);
      }
    };
    console.log(id);

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
        body: JSON.stringify({ id: id }),
      });
  
      const text = await response.text();
      console.log('Raw response:', text);
      
  
      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        return;
      }
  
      
      const data = JSON.parse(text);
      console.log('Parsed data:', data);
  
      setFilteredHistory(data); 
    } catch (error) {
      console.error('Error fetching history data:', error);
    }
  };
  
  
  
 

  const handleHistoryClick = () => {
    setModalVisible(true);
  };



  const handleCall = (phoneNumber) => {
    if (!phoneNumber) return;
    const url = `tel:${encodeURIComponent(phoneNumber)}`;
    Linking.openURL(url).catch((err) =>
      console.error('Failed to open dial pad', err)
    );
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours %= 12;
    hours = hours || 12;
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    if (userData) {

      axios
        .get(`https://staff.annaianbalayaa.org/public/api/call_status_list?role=${userData.dept}`)
        .then((response) => {
          if (response.data) {
            const formattedData = response.data.map((item) => ({
              value: item.name,
              key: item.id,
            }));
            setData(formattedData); 
          }
        })
        .catch((error) => {
          console.error('Error fetching status list:', error);
          Alert.alert('Error', 'Failed to fetch status list.');
        })
        .finally(() => {
          setLoading(false); // End loading
        });
    }
  }, [userData]);

  const handleSave = async () => {
    if (!selected || !notes) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }
  
    const branch = userData?.branch || '';
    const dept = userData?.dept || '';
    
    // Validate only if the user is NOT a telecaller and status is "payment_received"
  if (dept !== 'telecaller' && selected === 'payment_received') {
    if (!amount) {
      Alert.alert('Validation Error', 'Amount is required when payment is received.');
      return;
    }
    if (!selectedPaymentMode) {
      Alert.alert('Validation Error', 'Payment Mode is required when payment is received.');
      return;
    }
    if (!selectedSendReceipt) {
      Alert.alert('Validation Error', 'Send Receipt selection is required when payment is received.');
      return;
    }
    if (!transactionNo) {
      Alert.alert('Validation Error', 'Transaction Number is required when payment is received.');
      return;
    }
  }
  
    try {
      const payload = {
        id,
        branch,
        dept,
        name: details?.name || '',
        mobile: details?.mobile || '',
        amount,
        transaction_no: transactionNo,
        notes,
        status: selected,
        payment_mode: selectedPaymentMode,
        send_receipt: selectedSendReceipt,
        date,
        specialdaymessage,
      };
  
      const response = await axios.post(
        'https://staff.annaianbalayaa.org/public/api/call_status_save',
        payload
      );
  
      if (response.data?.success) {
        setAmount('');
        setTransactionNo('');
        setSelected(null);
        setNotes('');
        setSelectedPaymentMode(null);
        setSelectedSendReceipt(false);
        setDate('');
        setSpecialDayMessage('');
  
        Alert.alert('✅ Success', 'Call Activity has been saved successfully');
  
        navigation.replace('CallDuty');
      } else {
        Alert.alert('Error', 'Failed to save data.');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'An error occurred while saving data.');
    }
  };
  
  
  const handleConfirm = (selectedDate) => {
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); 
    const year = selectedDate.getFullYear();
  
    const formattedDate = `${day}-${month}-${year}`; // Format as DD-MM-YYYY
    setDate(formattedDate); 
    setDatePickerVisibility(false);
  };

  const maskMobile = (mobile) => {
    if (!mobile || typeof mobile !== 'string') return 'N/A'; 
    
    if (mobile.length < 0) return 'XXXX'; 
    
    return `${mobile.slice(0, 2)}${'X'.repeat(Math.max(0, mobile.length - 4))}${mobile.slice(-2)}`;
};
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.activityContainer}>
          <Text style={styles.activityTitle}>Call Activity</Text>
          <View style={styles.table}>
            <View style={styles.row}>
              <Text style={styles.cellTitle}>Name</Text>
              <Text style={styles.cellValue}>{details.name || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.cellTitle}>Mobile No</Text>
              <Text style={styles.cellValue}>{details.mobile ? maskMobile(details.mobile) : 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.cellTitle}>Last Update</Text>
              <Text style={styles.cellValue}>
                {formatDateTime(details.updated_at)}
              </Text>
            </View>
            <View style={styles.row}>
            <Text style={styles.cellTitle}>Status</Text>
            <TouchableOpacity onPress={handleHistoryClick}>
              <Text style={styles.linkText}>History</Text>
            </TouchableOpacity>
          </View>
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
  data={filteredHistory} 
  keyExtractor={(item) => item.id.toString()} 
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
        </View>

        <View style={styles.iconRow}>
          <TouchableOpacity
            onPress={() => handleCall(details.mobile)}
            accessible
            accessibilityLabel="Call user"
          >
            <Image
              source={require('../CallActivity/phone-call.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.dropdowncontainer}>
        <View style={{ position: "relative" }}>
  {!selected && (
    <Text style={styles.placeholderText}>
      Select Status <Text style={{ color: "red" }}>*</Text>
    </Text>
  )}
  <SelectList
    setSelected={(val) => {
      const selectedItem = data.find((item) => item.key === val)?.value;
      setSelected(selectedItem);
    }}
    data={data}
    save="key"
    placeholder=" "
  />
</View>

<View style={{ position: "relative", marginTop: 10 }}>
  {!notes && (
    <Text style={styles.placeholderText}>
      Notes <Text style={{ color: "red" }}>*</Text>
    </Text>
  )}
  <TextInput
    style={styles.input1}
    placeholder=""
    multiline
    value={notes}
    onChangeText={setNotes}
  />
</View>


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

{/* {userData?.dept !== 'TELECALLER' && (
        // Date Picker Column
        <View style={styles.inputRow}>
          <TouchableOpacity
            onPress={() => setDatePickerVisibility(true)}
            style={[styles.input, styles.datePickerButton]}
          >
            <Text style={styles.dateText}>
              {date || 'Select Date'}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={() => setDatePickerVisibility(false)}
          />

<TextInput
                style={[styles.input, { flex: 1, marginLeft: 5 }]}
                placeholder="Special Day Message"
                placeholderTextColor="#888888"
                value={specialdaymessage}
                onChangeText={setSpecialDayMessage}
              />
        </View>
      )} */}

           {userData?.dept !== 'TELECALLER' && (
            <View style={styles.dropdowncontainer1}>
            <View style={styles.row1}>
              <View style={[styles.dropdownWrapper, { marginRight: 10 }]}>
                <SelectList
                  setSelected={(val) => setSelectedPaymentMode(val)}
                  data={[{ key: '1', value: 'CASH' }, { key: '2', value: 'UPI' }, { key: '3', value: 'NET BANKING' },{ key: '4', value: 'WEBSITE PAYMENT' }]} 
                  save="value"
                  placeholder="Payment Mode"
                  placeholderTextColor="#888888"
                />
              </View>
          
              <View style={styles.dropdownWrapper}>
                <SelectList
                  setSelected={(val) => setSelectedSendReceipt(val)}
                  data={[{ key: '1', value: 'Yes' }, { key: '2', value: 'No' }]}
                  save="value"
                  placeholder="Send Receipt"
                  placeholderTextColor="#888888"
                />
              </View>
            </View>
          </View>
          
          )}

          

         
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>SAVE</Text>
        </TouchableOpacity>
      </ScrollView>
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
    justifyContent: "center",
    paddingHorizontal: 20,
    marginLeft:10,
    marginRight:10,
    marginTop:15,
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
  placeholderText: {
    position: 'absolute',
    left: 10,
    top: 10,
    color: '#888888',
    fontSize: 16,
    zIndex: 1,
  },
  input1: {
    borderWidth: 1,
    borderColor: '#888888',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    color: '#000',
  },
  dropdowncontainer: {
    justifyContent: "center",
    paddingHorizontal: 20,
    marginLeft:10,
    marginRight:10,
    marginTop:15,
  
  },
  dropdowncontainer1: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownWrapper: {
    flex: 1,
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
  inputRow: { flexDirection: 'row', marginVertical: 10 },
  dateText: { color: 'black', textAlign: 'center' },
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

export default CallActivity;
