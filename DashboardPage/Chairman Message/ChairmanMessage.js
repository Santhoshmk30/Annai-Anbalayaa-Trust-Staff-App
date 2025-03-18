import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, Text, Alert,ActivityIndicator,FlatList,FastImage } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const { width: screenWidth } = Dimensions.get('window');

const ChairmanMessage = () => {
    const scrollViewRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [apiData, setApiData] = useState(null);
    
      
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
          const response = await fetch(`https://staff.annaianbalayaa.org/public/api/chairman_message`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: userData.user_id, 
            }),
          });

          const data = await response.json();
          console.log('Received data:', data);
          setApiData(data); 
        } catch (error) {
          console.error('Error fetching API data:', error);
        }
      };

      fetchData(); 
    }
  }, [userData]); 


    return (
        <View style={styles.container}>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

        

<View style={styles.idCardContainer}>

<View style={styles.containermessage}>
  {apiData && apiData.length > 0 ? (
    <>
      <Text style={styles.chairman}>Chairman's Message:</Text>
      {apiData.map((item) => (
        <View key={item.id.toString()} style={styles.card}>
          <Text style={[styles.cardContent, { fontWeight: 'bold' }]}>{item.message}</Text>
        </View>
      ))}
    </>
  ) : (
    <Text style={styles.noMessage}>No Messages to Chairman</Text>
  )}
</View>


    
</View>

<View style={styles.spacer}>
               
            </View>
        </ScrollView>

       
</View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    idCardContainer: {
        alignItems: 'center', 
        marginBottom:30,
        marginTop:20,
    },
    
    spacer: {
        height: 100, 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f4f4',
        marginTop: 20,
    },
    containermessage: {
        flex: 1,
        padding: 10,
      },
      card: {
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
      chairman:{
        fontSize: 18,
        fontWeight: 'bold',
        marginRight:210,
        marginTop:20,
    },
      cardbranch: {
        fontSize: 14,
        marginBottom: 10,
      },
      cardid: {
        fontSize: 14,
        marginBottom: 10,
      },
      cardrole: {
        fontSize: 14,
        marginBottom: 10,
      },
      cardContent: {
        fontSize: 16,
      },
      noMessage: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'gray',
        textAlign: 'center',
        marginTop: 10,
      },
});

export default ChairmanMessage;
