import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ApplyLeave = () => {
  const [userId, setUserId] = useState(null);  
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId'); // Adjust this key if necessary
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchUserId();
  }, []);
  console.log(userId);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  
  const url = userId ? `https://staff.annaianbalayaa.org/staff/leave_form/${userId}` : '';

  return (
    <View style={styles.container}>
      {userId ? (
        <WebView
          source={{ uri: url }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          mixedContentMode="always"
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
          }}
          onLoadStart={() => console.log('WebView loading started')}
          onLoad={() => console.log('WebView loaded successfully')}
        />
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1},
});

export default ApplyLeave;
