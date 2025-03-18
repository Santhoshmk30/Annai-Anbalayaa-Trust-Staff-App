import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Linking, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Support = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchSavedData = async () => {
      try {
        const savedData = await AsyncStorage.getItem("userData");
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          if (parsedData && parsedData.user_id) {
            setUserData(parsedData); // Store the user data
          } else {
            console.warn("User data is empty or does not contain user_id");
          }
        } else {
          console.warn("No userData found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error fetching saved data:", error);
      }
    };

    fetchSavedData();
}, []);


  const handleCall = () => Linking.openURL("tel:+919941840841");
  const handleEmail = () => Linking.openURL("mailto:annaianbalayaatrust5@gmail.com");
  const handleWhatsApp = () => Linking.openURL("https://wa.me/919941840841");

  const handleSubmit = async () => {
    if (!name || !mobile || !message) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (!userData.user_id) {
      Alert.alert("Error", "User ID not found. Please log in again.");
      return;
    }

    try {
      let response = await fetch("https://staff.annaianbalayaa.org/public/api/staff_support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userData.user_id, name, mobile, message }),
      });

      let json = await response.json();
      console.log(userData.user_id);
      if (json.success) {
        Alert.alert("Success", "Your message has been sent!");
        setName(""); setMobile(""); setMessage("");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <TouchableOpacity onPress={handleCall} style={styles.button}><Text style={styles.buttonText}>Call Support</Text></TouchableOpacity>
      <TouchableOpacity onPress={handleEmail} style={styles.button}><Text style={styles.buttonText}>Email Support</Text></TouchableOpacity>
      <TouchableOpacity onPress={handleWhatsApp} style={styles.button}><Text style={styles.buttonText}>WhatsApp Support</Text></TouchableOpacity>

      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>Send a Message</Text>
      <TextInput placeholder="Your Name" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Mobile Number" style={styles.input} keyboardType="phone-pad" value={mobile} onChangeText={setMobile} />
      <TextInput placeholder="Message" style={[styles.input]} multiline value={message} onChangeText={setMessage} />
      <TouchableOpacity onPress={handleSubmit} style={styles.button}><Text style={styles.buttonText}>Submit</Text></TouchableOpacity>
    </ScrollView>
  );
};

const styles = {
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginVertical: 10, borderRadius: 5 },
  button: { backgroundColor: "#4F46E5", padding: 15, marginVertical: 10, borderRadius: 5, alignItems: "center" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" }
};

export default Support;
