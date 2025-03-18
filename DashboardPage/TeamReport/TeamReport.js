import React, { useState,useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';


const TeamReport = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [tab, setTab] = useState('Call Task');
  
  const isActiveRoute = (routeName) => {
    return route.name === routeName;
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


  return (
    <View style={styles.container}>
      <View style={styles.detailsContainer}>
        <View style={styles.detailBox}>
          <Image
            source={require('../TeamReport/customer-service.png')}
            style={styles.largeIcon}
          />
          <Text style={styles.detailText}>0</Text>
          <Text style={styles.detailSubText}>Total Task</Text>
        </View>
        <View style={styles.detailBox}>
          <Image
            source={require('../TeamReport/check-mark.png')}
            style={styles.largeIcon}
          />
          <Text style={styles.detailText}>0</Text>
          <Text style={styles.detailSubTextcomplete}>Complete</Text>
        </View>
        <View style={styles.detailBox}>
          <Image
            source={require('../TeamReport/cross.png')}
            style={styles.largeIcon}
          />
          <Text style={styles.detailText}>0</Text>
          <Text style={styles.detailSubTextpending}>Pending</Text>
        </View> 
      </View>

     
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[
            styles.navButton,
            isActiveRoute('ANNAI ANBALAYAA TRUST') && styles.activeNavButton,
          ]}
          onPress={() => navigation.navigate('ANNAI ANBALAYAA TRUST')}
        >
          <Image
            source={require('../Icons/home(1).png')}
            style={styles.icon}
          />
          <Text
            style={[
              styles.navText,
              isActiveRoute('ANNAI ANBALAYAA TRUST') && styles.activeNavText,
            ]}
          >
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
          style={[
            styles.navButton,
            isActiveRoute('TeamReport') && styles.activeNavButton,
          ]}
          onPress={() => navigation.navigate('TeamReport')}
        >
          <Image
            source={require('../Icons/report1.png')}
            style={styles.icon}
          />
          <Text
            style={[
              styles.navText,
              isActiveRoute('TeamReport') && styles.activeNavText,
            ]}
          >
            Report
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            isActiveRoute('Logout') && styles.activeNavButton,
          ]}
          onPress={handleLogout}
        >
          <Icon name="logout" size={30} color="white" />
          <Text
            style={[
              styles.navText,
              isActiveRoute('Logout') && styles.activeNavText,
            ]}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  largeIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
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
  detailSubTextcomplete:{
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
});

export default TeamReport;