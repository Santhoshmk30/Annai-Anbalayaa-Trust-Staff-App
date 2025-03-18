import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterPage({ navigation }) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');
    setLoading(true);
  
    // Input validation
    if (!phone || phone.length < 8) {
      setError('Please enter a valid Mobile Number/Staff ID.');
      setLoading(false);
      return;
    }
  
    try {
      const apiUrl = "https://staff.annaianbalayaa.org/public/api/get_profile";
  
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: phone,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        await AsyncStorage.setItem('userId', phone);
        navigation.navigate("VerifyOtpPage");
      } else {
        setError(result.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please check  your internet connection.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo1}
        source={require("../RegisterPage/Register.png")}
      />
      <View style={styles.card}>
        <TextInput
          onChangeText={setPhone}
          value={phone}
          placeholder="Mobile Number/Staff ID"
          placeholderTextColor="grey"
          style={styles.textInput}
          keyboardType="textInput"
          autoCapitalize="none"
        />

{error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : null}
        {loading ? (
          <ActivityIndicator size="large" color="#FF1493" />
        ) : (
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo1: {
    width: width * 0.8, // 80% of the screen width
    height: width * 0.8, // Aspect ratio (adjust based on image)
    resizeMode: "contain",
    marginTop: 20, // Top margin to push it slightly down
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: 360,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginTop: 20, // Space between image and card
  },
  textInput: {
    borderWidth: 1,
    borderColor: "gray",
    width: "100%",
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    color: "#000000",
  },
  registerButton: {
    backgroundColor: "#FD511D", // This is the equivalent of rgb(253, 81, 29)
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 10,
  },
  registerButtonText: {
    color: "#fff",
    fontWeight: "bold",
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
