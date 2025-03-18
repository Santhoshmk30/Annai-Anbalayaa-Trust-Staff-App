import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Don't forget to import AsyncStorage
import { useNavigation } from '@react-navigation/native';

const SigninPage = () => {
  const navigation = useNavigation();

  const [userData, setUserData] = useState(null); // State for user data

  useEffect(() => {
    const fetchSavedData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('userData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setUserData(parsedData); // Store the parsed data in state
        } else {
          console.log('No user data found in AsyncStorage.');
        }
      } catch (error) {
        console.error('Error fetching saved data:', error);
      }
    };

    fetchSavedData(); 
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../VerifyOtp/trust-logo.png')} // Replace with your logo file path
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Sign In Title */}
      <Text style={styles.signInText}>Sign in</Text>

      {/* User Details */}
      {userData ? (
        <View style={styles.card}>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Name</Text>
          <Text style={styles.tableCell}>{userData.name || 'N/A'}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Staff ID</Text>
          <Text style={styles.tableCell}>{userData.user_id || 'N/A'}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Mobile No</Text>
          <Text style={styles.tableCell}>{userData.phone || 'N/A'}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Role</Text>
          <Text style={styles.tableCell}>{userData.dept || 'N/A'}</Text>
        </View>
     
      </View>
      
      
      ) : (
        <Text>Loading user data...</Text>
      )}

      {/* Buttons */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate('Otp')}
      >
        <Text style={styles.actionButtonText}>Get OTP</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate('ScanPage')}
      >
        <Text style={styles.actionButtonText}>Scan QR CODE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
  },
  signInText: {
    color: '#000',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card:{
    width:'100%',
    backgroundColor: '#fff',
    borderRadius: 10, // Rounded corners
    padding: 10, // Inner padding
    elevation: 5, 
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
    width: '50%',
    textAlign: 'left', 
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 8,
  },
  tableCell: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    width: '50%',
    textAlign: 'left', 
    marginLeft:15,
  },
  actionButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#f5f5f5',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SigninPage;
