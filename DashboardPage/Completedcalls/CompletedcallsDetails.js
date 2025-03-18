import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CompletedcallsDetails = ({ route }) => {
  const { user_id, date } = route.params;
  const navigation = useNavigation();
  const [completedcallData, setCompletedCallData] = useState([]);
  const [tab, setTab] = useState('Call Task');
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  
 
  

  useEffect(() => {
   
    const fetchCompletedCallData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://staff.annaianbalayaa.org/public/api/complete_list_details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            id:user_id,
            date:date,
          }),
        });
    
        console.log('Response Status:', response.status); 
        console.log('Response OK:', response.ok);
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const result = await response.json();
        console.log('Fetched Data:', result); 

        setCompletedCallData(result|| 0);
        console.log(result);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    

    fetchCompletedCallData();
  }, [user_id, date]);
  
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

  

 
  const maskMobile = (mobile) => {
    if (!mobile) return 'N/A'; 
    
    return `${mobile.slice(0, 2)}${'X'.repeat(mobile.length - 4)}${mobile.slice(-2)}`;
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
  onChangeText={(text) => setSearchText(text)} 
/>
        
      </View>

      <FlatList
  data={filterData(completedcallData,searchText)}
  keyExtractor={(item, index) => item.id?.toString() || index.toString()}
  renderItem={({ item }) => (
    <TouchableOpacity onPress={async () => {
      try {
        
        await AsyncStorage.setItem('invoice_no', item.invoice_no.toString());
        const storedInvoiceNo = await AsyncStorage.getItem('invoice_no');
if (storedInvoiceNo) {
console.log('Invoice number saved:', storedInvoiceNo);

navigation.navigate('DonationReceipt');
} else {
console.error('Failed to save invoice_no to AsyncStorage');
}
} catch (error) {
console.error('Error while saving invoice_no:', error);
}
    }}>
      <View style={styles.taskItem}>
        <Image source={require('../Reminder/user(2).png')} style={styles.largeIcon} />
        <View style={styles.textContainer}>
          <Text style={styles.taskText}>{item.name} - {maskMobile(item.mobile)}</Text>
          <Text style={styles.taskText3}>Notes: {item.notes ? item.notes : 'N/A'}</Text>

          

          
          {item.invoice_no && (
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={async () => {
                try {
                  
                  await AsyncStorage.setItem('invoice_no', item.invoice_no.toString());
                  const storedInvoiceNo = await AsyncStorage.getItem('invoice_no');
      if (storedInvoiceNo) {
        console.log('Invoice number saved:', storedInvoiceNo);
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
/>
<View style={styles.spacer}>
               
            </View>

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
  spacer: {
    height: 4, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
},
});

export default CompletedcallsDetails;
