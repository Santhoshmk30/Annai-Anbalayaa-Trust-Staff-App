import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';


const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [userData, setUserData] = useState(null);

    const navigation = useNavigation(); 

    useEffect(() => {
        const fetchSavedData = async () => {
          try {
            const savedData = await AsyncStorage.getItem("userData");
            if (savedData) {
              const parsedData = JSON.parse(savedData);
              if (parsedData && parsedData.user_id) {
                setUserData(parsedData); 
                fetchProfileData(parsedData.user_id); 
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

    const fetchProfileData = async (userId) => {
        if (!userId) {
          console.warn("User ID is missing");
          return;
        }
        try {
          const response = await fetch("https://staff.annaianbalayaa.org/public/api/get_profile_details", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: userId }), 
          });

          const result = await response.json();
          if (response.ok) {
            setProfileData(result);
            console.log(result) 
          } else {
            console.log("Error fetching profile:", result);
          }
        } catch (error) {
          console.error("API Error:", error);
        }
    };

    const handleSave = async () => {
        
    };
    const handleLogout = async () => {
        Alert.alert(
          "Logout",
          "Are you sure you want to logout?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "OK",
              onPress: async () => {
                try {
                  const response = await fetch(`https://staff.annaianbalayaa.org/public/api/logout`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id:userData.user_id }),
                  });
      
                  if (!response.ok) {
                    throw new Error('Failed to logout');
                  }
      
                
                  await AsyncStorage.setItem('isLoggedOut', 'true'); 
                  await AsyncStorage.removeItem('isLoggedIn');
      
                 
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'SigninPage' }],
                  });
                } catch (error) {
                  console.error('Error during logout:', error);
                }
              },
            },
          ],
          { cancelable: false }
        );
      };
      

    const isActiveRoute = (route) => {
        const currentRoute = navigation.getState()?.routes[navigation.getState().index]?.name;
        return currentRoute === route;
    };

    const handleDeleteAccount = async () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                             const response = await fetch(`https://staff.annaianbalayaa.org/public/api/logout`, {
                                 method: 'POST',
                                 headers: {
                                   'Content-Type': 'application/json',
                                 },
                                 body: JSON.stringify({ user_id:userData.user_id }),
                               });
                  
                               if (!response.ok) {
                                 throw new Error('Failed to Delete Account');
                               }

                              
                            await AsyncStorage.clear();
                            await AsyncStorage.setItem('isAccountDeleted', 'true');
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'RegisterPage' }],
                            });
                        } catch (error) {
                            console.error('Error during account deletion:', error);
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };
    
    
    
    

    return (
        <View style={styles.mainContainer}>
            <ScrollView contentContainerStyle={styles.container}>

                <View style={styles.profileimage}>

            {userData && userData.image ? (
        <Image
            source={{ uri: `https://staff.annaianbalayaa.org/${userData.image}` }}
            style={[styles.image, { borderRadius: 20 }]} 
            resizeMode="cover"
            onError={(error) => console.log('Image load error:', error.nativeEvent.error)}
        />
        
    ) : (
        <Image
            source={require('../Icons/profileimage.png')} 
            style={[styles.image, { borderRadius: 25 }]} 
            resizeMode="cover"
        />
        
    )}
    <TouchableOpacity style={styles.cameraButton} >
        <Image source={require('../Icons/camera1.png')} style={styles.cameraIcon} />
      </TouchableOpacity>
</View>
<Text style={styles.label}>Email</Text>
                <Text style={styles.input}>{profileData?.email || 'Not Available'}</Text>

                <Text style={styles.label}>Phone Number</Text>
                <Text style={styles.input}>{profileData?.phone || 'Not Available'}</Text>

                <Text style={styles.label}>Aadhar Number</Text>
                <Text style={styles.input}>{profileData?.aadhar || 'Not Available'}</Text>

                <Text style={styles.label}>PAN Number</Text>
                <Text style={styles.input}>{profileData?.pan || 'Not Available'}</Text>

                <Text style={styles.sectionHeader}>Bank Details</Text>

                <Text style={styles.label}>Account Number</Text>
                <Text style={styles.input}>{profileData?.accountNumber || 'Not Available'}</Text>

                <Text style={styles.label}>IFSC Code</Text>
                <Text style={styles.input}>{profileData?.ifsc || 'Not Available'}</Text>

                <Text style={styles.label}>Account Holder Name</Text>
                <Text style={styles.input}>{profileData?.accountHolderName || 'Not Available'}</Text>


                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deletebutton} onPress={handleDeleteAccount}>
                    <Text style={styles.buttonText}>Delete Account</Text>
                </TouchableOpacity>

               <View style={styles.spacer}>
               
               </View>
            </ScrollView>
            

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity
                    style={[styles.navButton, isActiveRoute('ANNAI ANBALAYAA TRUST') && styles.activeNavButton]}
                    onPress={() => navigation.navigate('ANNAI ANBALAYAA TRUST')}
                >
                    <Image source={require('../Icons/home(1).png')} style={styles.icon} />
                    <Text style={[styles.navText, isActiveRoute('ANNAI ANBALAYAA TRUST') && styles.activeNavText]}>
                        Home
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
    style={[styles.navButton, isActiveRoute('Profile') && styles.activeNavButton]}
    onPress={() => navigation.navigate('Profile')}
>
    {userData && userData.image ? (
        <Image
            source={{ uri: `https://staff.annaianbalayaa.org/${userData.image}` }}
            style={[styles.profileicon, { borderRadius: 20 }]} 
            resizeMode="cover"
            onError={(error) => console.log('Image load error:', error.nativeEvent.error)}
        />
    ) : (
        <Image
            source={require('../Icons/profileimage.png')} 
            style={[styles.icon, { borderRadius: 25 }]} 
            resizeMode="cover"
        />
    )}
    <Text style={[styles.navText, isActiveRoute('Profile') && styles.activeNavText]}>
        Profile
    </Text>
</TouchableOpacity>


                <TouchableOpacity
                    style={[styles.navButton, isActiveRoute('TeamReport') && styles.activeNavButton]}
                    onPress={() => navigation.navigate('TeamReport')}
                >
                    <Image source={require('../Icons/report1.png')} style={styles.icon} />
                    <Text style={[styles.navText, isActiveRoute('TeamReport') && styles.activeNavText]}>
                        Report
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.navButton, isActiveRoute('Logout') && styles.activeNavButton]}
                    onPress={handleLogout}
                >
                     <Icon name="logout" size={30} color="white" />
                    <Text style={[styles.navText, isActiveRoute('Logout') && styles.activeNavText]}>
                        Logout
                    </Text>
                </TouchableOpacity>
            </View>
            
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#e9f0f7',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        fontSize: 16,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#4F46E5',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 15,
    },
    deletebutton: {
        backgroundColor: '#E53935',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 15,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    bottomNav: {
        position: 'absolute',
        bottom: 10,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor:"#5a4ccf",
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
        borderRadius:30,
    },
    navButton: {
        alignItems: 'center',
    },
    icon: {
        width: 30,
        height: 30,
    },
    icon1: {
        width: 25,
        height: 29,
    },
    profileicon: {
        width: 30,
        height: 30,
    },
    image:{
        width: 150,
        height: 150,
        borderWidth:5,
        borderColor:'#fff',
    },
    profileimage:{
       alignItems:'center',
    },
    navText: {
        fontSize: 12,
        marginTop: 5,
        color: 'white',
        fontWeight:'bold',
    },
    activeNavButton: {
        borderBottomWidth: 2,
        borderBottomColor: 'orange',
    },
    activeNavText: {
        color: 'white',
        fontWeight:'bold',
    },
    cameraButton: {
        bottom: 30,
        left: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 8,
        borderRadius: 15,
    },
    cameraIcon: {
        width: 20,
        height: 25,
    },
    spacer: {
        height: 60, 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        marginTop: 20,
    },
});

export default Profile;
