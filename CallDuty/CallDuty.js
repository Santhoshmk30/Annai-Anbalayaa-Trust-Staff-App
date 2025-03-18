import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert,Button,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CallDuty = () => {
  const navigation = useNavigation();
  const [tab, setTab] = useState('Call Task');
  const [callTask, setCallTasks] = useState([]);
  const [callHistory, setCallHistory] = useState([]);
  const [callReminder, setCallReminder] = useState([]);
  const [callCompleted, setCallCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [countCallDuty, setCountCallDuty] = useState(0);
  const [oldCallDutyCount, setOldCallDutyCount] = useState(0);
  const [ReminderCallCount, setReminderCallCount] = useState(0);
  const [CompletedCallCount, setCompletedCallCount] = useState(0);
  const [totalTasksCount, settotalTasksCount] = useState(0);
  const [remainingTasksCount, setremainingTasksCount] = useState(0);
  const [pendingTasksCount, setpendingTasksCount] = useState(0);
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    const fetchSavedData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('userData');
        if (savedData) setUserData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error fetching saved data:', error);
      }
    };
    

    fetchSavedData();
  }, []);

  // Fetch data from the API
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

      const response = await fetch('https://staff.annaianbalayaa.org/public/api/call_duty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userData.user_id }),
      });

      const result = await response.json();
      setCallTasks(result.call_task || []);
      setCallHistory(result.Call_history || []);
      settotalTasksCount(result.totalTasks || 0);
      setpendingTasksCount(result.pendingTasks || 0);
      setremainingTasksCount(result.Remainingtasks || 0);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  

  

  
  useEffect(() => {
    fetchData();
  }, []);
  
  const handleReload = () => {
    navigation.replace('CallDuty');
  };

 
  const handleTaskPress = (taskId, taskDetails) => {
    navigation.navigate('CallActivity', { id: taskId, details: taskDetails });
  };

  const handleTaskPressHistory = (taskId, taskDetails) => {
    navigation.navigate('CallActivity', { id: taskId, details: taskDetails });
  };
  
  const handleReminderPress = (taskId, taskDetails) => {
    navigation.navigate('CallActivity', { id: taskId, details: taskDetails });
  };const handleCompletedPress = (taskId, taskDetails) => {
    navigation.navigate('CallActivity', { id: taskId, details: taskDetails });
  };

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

  // if (loading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <Image 
  //         source={require('../VerifyOtp/trust-logo.png')} 
  //         style={styles.logo} 
  //       />
  //       <ActivityIndicator size="large" color="#5a4ccf" />
        
  //     </View>
  //   );
  // }
  const maskMobile = (mobile) => {
    if (!mobile || typeof mobile !== 'string') return 'N/A'; // Handle null, undefined, and non-string cases
    
    if (mobile.length < 0) return 'XXXX'; // Handle very short numbers
    
    return `${mobile.slice(0, 2)}${'X'.repeat(Math.max(0, mobile.length - 4))}${mobile.slice(-2)}`;
};
  
  
  

  return (
    <View style={styles.container}>
      <View style={styles.detailsContainer}>
        <View style={styles.detailBox}>
          <Image source={require('../CallDuty/customer-service.png')} style={styles.largeIcon} />
          <Text style={styles.detailText}>{totalTasksCount}</Text>
          <Text style={styles.detailSubText}>Total Calls</Text>
        </View>


        {/* <View style={styles.detailBox}>
          <Image source={require('../CallDuty/cross.png')} style={styles.largeIcon} />
          <Text style={styles.detailText}>
            {remainingTasksCount}
          </Text>
          <Text style={styles.detailSubTextremaining}>Today Remaining Calls</Text>
        </View> */}
        
        <View style={styles.detailBox}>
          <Image source={require('../CallDuty/cross.png')} style={styles.largeIcon} />
          <Text style={styles.detailText}>
            {pendingTasksCount}
          </Text>
          <Text style={styles.detailSubTextpending}>Total Pending Calls</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, tab === 'Call Task' && styles.activeTab]}
          onPress={() => setTab('Call Task')}
        >
          <Text style={tab === 'Call Task' ? styles.activeTabText : styles.tabText}>
            Calls 
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'Call History' && styles.activeTab]}
          onPress={() => setTab('Call History')}
        >
          <Text style={tab === 'Call History' ? styles.activeTabText : styles.tabText}>
            Pending Calls
          </Text>
        </TouchableOpacity>
       {/*<TouchableOpacity
          style={[styles.tab, tab === 'Call Reminder' && styles.activeTab]}
          onPress={() => setTab('Call Reminder')}
        >
          <Text style={tab === 'Call Reminder' ? styles.activeTabText : styles.tabText}>
            Call Reminder ({ReminderCallCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'Call Completed' && styles.activeTab]}
          onPress={() => setTab('Call Completed')}
        >
          <Text style={tab === 'Call Completed' ? styles.activeTabText : styles.tabText}>
            Call Completed ({CompletedCallCount})
          </Text>
        </TouchableOpacity>*/}
      </View>

      <View style={styles.headerContainer}>
      <TextInput
  style={styles.searchBar}
  placeholder="Search by Name or Mobile"
  placeholderTextColor="grey"
  value={searchText}
  onChangeText={(text) => setSearchText(text)} 
/>
<TouchableOpacity style={styles.refreshButton} onPress={handleReload} >
<Text style={styles.refreshButtonText}>Refresh</Text>
    </TouchableOpacity>
        
      </View>

      {tab === 'Call Task' ? (
  <FlatList
  data={filterData(callTask, searchText)}
  keyExtractor={(item, index) => item.id?.toString() || index.toString()}
  renderItem={({ item }) => (
    <TouchableOpacity onPress={() => handleTaskPress(item.id, item)}>
      <View style={styles.taskItem}>
        <Image source={require('../CallDuty/user(2).png')} style={styles.largeIcon} />
        <View style={styles.textContainer}>
        <Text style={styles.taskText}>{item.name} - {maskMobile(item.mobile)}</Text>
        {userData?.dept !== 'TELECALLER' && (
        <Text style={styles.taskText4}>Notes:{item.notes ? item.notes : 'N/A'}</Text>
      )}
        </View>
        
      </View>
    </TouchableOpacity>
  )}
/>

) : tab === 'Call History' ? (
  <FlatList
    data={filterData(callHistory, searchText)}
    keyExtractor={(item, index) => item.id?.toString() || index.toString()}
    renderItem={({ item }) => (
      <TouchableOpacity onPress={() => handleTaskPressHistory(item.id, item)}>
        <View style={styles.taskItem}>
          <Image source={require('../CallDuty/user(2).png')} style={styles.largeIcon} />
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
) : tab === 'Call Reminder' ? (
  {/*<FlatList
    data={filterData(callReminder,searchText)}
    keyExtractor={(item, index) => item.id?.toString() || index.toString()}
    renderItem={({ item }) => (
      <TouchableOpacity onPress={() => handleReminderPress(item.id, item)}>
        <View style={styles.taskItem}>
          <Image source={require('../CallDuty/user(2).png')} style={styles.largeIcon} />
          <View style={styles.textContainer}>
            <Text style={styles.taskText}>{item.name} - {maskMobile(item.mobile)}</Text>
            <Text style={styles.taskText1}>{formatDateTime(item.updated_at)}</Text>
            <Text style={styles.taskText2}>Status: {item.status ? item.status : 'N/A'}</Text>
            <Text style={styles.taskText3}>Notes: {item.notes ? item.notes : 'N/A'}</Text>

          </View>
        </View>
      </TouchableOpacity>
    )}
  />*/}
) : (
  {/*<FlatList
  data={filterData(callCompleted,searchText)}
  keyExtractor={(item, index) => item.id?.toString() || index.toString()}
  renderItem={({ item }) => (
    <TouchableOpacity onPress={() => handleCompletedPress(item.id, item)}>
      <View style={styles.taskItem}>
        <Image source={require('../CallDuty/user(2).png')} style={styles.largeIcon} />
        <View style={styles.textContainer}>
          <Text style={styles.taskText}>{item.name} - {maskMobile(item.mobile)}</Text>
          <Text style={styles.taskText1}>{formatDateTime(item.updated_at)}</Text>
          <Text style={styles.taskText2}>Status: {item.status}</Text>
          <Text style={styles.taskText3}>Notes: {item.notes ? item.notes : 'N/A'}</Text>

          

          
          {item.invoice_no && (
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={async () => {
                try {
                  // Store invoice_no in AsyncStorage
                  await AsyncStorage.setItem('invoice_no', item.invoice_no.toString());
                  const storedInvoiceNo = await AsyncStorage.getItem('invoice_no');
      if (storedInvoiceNo) {
        console.log('Invoice number saved:', storedInvoiceNo);
        // Navigate to DonationReceipt page after confirming it was saved
        navigation.navigate('DonationReceipt');
      } else {
        console.error('Failed to save invoice_no to AsyncStorage');
      }
    } catch (error) {
      console.error('Error while saving invoice_no:', error);
    }
              }}
            >
              <Text style={styles.buttonText}>Invoice</Text>
              
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )}
/>*/}
)}

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    marginVertical: 20,
    paddingHorizontal: 10, 
  },
  detailBox: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f8ff',
    marginHorizontal: 5,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  largeIcon: {
    width: 40,
    height: 40,
    marginBottom: 10, // Space between icon and text
  },
  detailText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  detailSubText: {
    fontSize: 14,
    color: '#4F46E5',
    textAlign: 'center',
    fontWeight:'bold',
  },
  detailSubTextremaining:{
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
  tabText: { fontSize: 12, color: '#555' },
  activeTabText: { fontSize: 16, color: '#5a4ccf', fontWeight: 'bold' },
  searchBar: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 10,
    borderRadius: 8,
    elevation: 2,
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

  loadingIcon:{
    width:27,
    height:27,
  },
  
  sortingContainer: {
    justifyContent: 'center',   
    alignItems: 'center',          
  },
  refreshButton: {
    paddingVertical: 6,           
    paddingHorizontal: 12,        
    backgroundColor: '#4F46E5',   
    borderRadius: 5,               
  },
  refreshButtonText: {
    color: '#fff',                
    fontSize: 14,                  
    fontWeight: 'bold',            
  },
  taskItem: {
    flexDirection: 'row', // Keeps the image and text container side by side
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
    flex: 1, // Allow text to occupy available space
    flexDirection: 'column', // Stack text vertically
    marginLeft: 10, // Adds space between image and text
  },
  taskText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 5,
  },
  taskText1: {
    fontSize: 14,
    color: '#666', // A slightly lighter color for differentiation
    marginTop: 5, // Space between lines
    marginLeft: 5,
  },
  taskText2: {
    fontSize: 14,
    color: '#008000', // Highlighting the status
    marginTop: 5,
    marginLeft: 5,
  },taskText3: {
    fontSize: 14,
    color: '#4F46E5', // Highlighting the status
    marginTop: 5,
    marginLeft: 5,
  },
  taskText4:{
    fontSize: 14,
    color: '#4F46E5', // Highlighting the status
    marginTop: 5,
    marginLeft:5,
  },
  largeIcon: { width: 30, height: 30 },
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
  buttonContainer: {
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default CallDuty;
