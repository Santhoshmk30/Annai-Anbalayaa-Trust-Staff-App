import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet,ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';

export default function Otp({ navigation }) {
    const [otp, setOtp] = useState('');
    const [userId, setUserId] = useState('');
    const [error, setError] = useState(''); 
    const [loading, setLoading] = useState(false);

    
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const id = await AsyncStorage.getItem('userId');
                if (id) {
                    setUserId(id);
                } else {
                    setError('User ID not found. Please log in again.');
                    setLoading(true);
                    navigation.navigate('RegisterPage'); 
                }
            } catch (error) {
                setError('Error fetching user ID. Please try again.');
            }
        };
        fetchUserId();
    }, []);

    const handleVerifyOtp = async () => {
        if (otp.length === 4) {
            setLoading(true); // Start loading
            try {
                const response = await fetch(`https://staff.annaianbalayaa.org/public/api/register_otp`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: userId,
                        otp,
                    }),
                });
    
                const responseText = await response.text();
                console.log('Raw Response:', responseText);
    
                if (!responseText) {
                    setError('Empty response from server. Please try again later.');
                    return;
                }
    
                let data;
                try {
                    data = JSON.parse(responseText);
                } catch (e) {
                    setError('Unexpected response format from server.');
                    return;
                }
    
                if (data.status === 'success' && data.data.otp == otp) {
                    await AsyncStorage.setItem('isLoggedIn', 'true');
                    await AsyncStorage.setItem('userData', JSON.stringify(data.data));
                    console.log('Login successful and data saved:', data.data);
    
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'ANNAI ANBALAYAA TRUST' }], // Replace 'HomePage' with your app's main page
                    });
                    } else {
                        setError(data.message || 'OTP verification failed.');
                    }
            } catch (error) {
                setError('An error occurred while verifying the OTP. Please try again.');
            } finally {
                setLoading(false); // End loading
            }
        } else {
            setError('Please enter a valid 4-digit OTP.');
        }
    };
    

    return (
        <ScrollView>
        <View style={styles.container}>

            <View style={styles.logoContainer}>
                <Image
                    source={require('../VerifyOtp/trust-logo.png')} // Replace with your logo path
                    style={styles.logo}
                />
            </View>

            {/* Title */}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>OTP Verification</Text>
            </View>

            {/* OTP Input */}
            <View style={styles.otpContainer}>
                <TextInput
                    style={styles.otpInput}
                    keyboardType="numeric"
                    maxLength={4}
                    value={otp}
                    onChangeText={setOtp}
                    placeholder="----"
                    placeholderTextColor="#ccc"
                    textAlign="center"
                />
            </View>

            {/* Error Message */}
            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : null}

            {loading ? (
          <ActivityIndicator size="large" color="#FF1493" />
        ) : (
            <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOtp}>
                <Text style={styles.verifyButtonText}>VERIFY OTP</Text>
            </TouchableOpacity>
            )}

            
        </View>
        
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height:900,
    },
    logoContainer: {
        marginTop: 50,
        marginBottom: 20,
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
    titleContainer: {
        backgroundColor: '#4A60E8', 
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 30,
        marginBottom: 30,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    otpInput: {
        fontSize: 24,
        width: 150,
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#ccc',
        backgroundColor: '#FFFFFF',
        color: '#000',
        marginHorizontal: 10,
    },
    verifyButton: {
        backgroundColor: '#FD511D', // Orange color for the button
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        marginTop: 30,
    },
    verifyButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
        backgroundColor: '#FFDDC1', // Light red background for errors
        paddingVertical: 10,
        borderRadius: 10,
    },
    errorText: {
        color: '#D8000C', // Red color for error text
        fontSize: 16,
        textAlign: 'center',
    },
});
