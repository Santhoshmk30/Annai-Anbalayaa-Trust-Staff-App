import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, Text, Alert,ActivityIndicator,FlatList,FastImage } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';


const { width: screenWidth } = Dimensions.get('window');

const Dashboard = () => {
    const navigation = useNavigation();
    const route = useRoute(); 
    const scrollViewRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [winnerData, setWinnerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [apiData, setApiData] = useState(null);
    const [imageError, setImageError] = useState(false);


    const sliderImages = [
        { id: 1, source: require("../DashboardPage/image11.png") },
        { id: 2, source: require("../DashboardPage/Trust.jpeg") },
        { id: 3, source: require("../DashboardPage/Trust1.jpeg") },
        { id: 4, source: require("../DashboardPage/sliderimage.png") },
    ];

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
        }, 4000);

        return () => clearInterval(intervalId);
    }, [sliderImages.length]);

    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({
                x: currentIndex * screenWidth,
                animated: true,
            });
        }
    }, [currentIndex]);

    const isActiveRoute = (routeName) => route.name === routeName;

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
    
      
      

    

    const [userName, setUserName] = useState(null); 

    useEffect(() => {
        const fetchUserName = async () => {
          try {
            const storedUserName = await AsyncStorage.getItem('username');
            if (storedUserName) {
              setUserName(storedUserName); 
            } else {
              setUserName('No user found');
            }
          } catch (error) {
            console.error('Error retrieving user name:', error);
            setUserName('Error retrieving user name');
          }
        };
        
    
        fetchUserName();
      }, []);
      
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

  useEffect(() => {
    if (userData) {
      const fetchData = async () => {
        setLoading(true); 
        try {
          const response = await fetch(`https://staff.annaianbalayaa.org/public/api/today_winner_list`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: userData.user_id,
              role: userData.dept,
            }),
          });
  
          const winnerData = await response.json();
          console.log('Received data:', winnerData);
          setWinnerData(winnerData); 
        } catch (error) {
          console.error('Error fetching API data:', error);
        } finally {
          setLoading(false); 
        }
      };
  
      fetchData(); 
    }
  }, [userData]); 
  

    return (
        <View style={styles.container}>
    
    
        <View style={styles.textBar1}>
        <Image
                source={require('../DashboardPage/Icons/logo.png')}
                style={styles.logo}
                resizeMode="cover"
            />
        <Text style={styles.topText}>ANNAI ANBALAYAA TRUST</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ChairmanMessage')}>
        <Icon name="notifications" size={30} color="white" />
    </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

        <View style={styles.carouselContainer}>
            
        <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
            >
                {sliderImages.map((item) => (
                    <Image
                        key={item.id1}
                        source={item.source}
                        style={{ width: screenWidth, height: 200, }} 
                        resizeMode="cover"
                    />
                ))}
            </ScrollView>
        </View>
    
        <View style={styles.idCardContainer}>
  <View style={styles.idCard}>
    {userData ? (
      <View style={styles.idCardDetailsRow}>
        <Image
            source={
              imageError
                ? require('../DashboardPage/Icons/profile.png') 
                : { uri: `https://staff.annaianbalayaa.org/${userData.image}`}
            }
            style={styles.profileImage}
            resizeMode="cover"
            onError={() => setImageError(true)} // Set error state on failure
          />
        <View style={styles.textContainer}>
          {/* User Details */}
          <Text style={styles.idCardName}>Name: {userData.name}</Text>
          <Text style={styles.idCardRole}>Role: {userData.dept}</Text>
          <Text style={styles.idCardBranch}>Branch: {userData.branch}</Text>
          <Text style={styles.idCardID}>STAFF ID: {userData.user_id}</Text>
        </View>
      </View>
    ) : (
      <Text style={styles.idCardName}>Loading data...</Text>
    )}
  </View>

  
</View>



        
        <View style={styles.contentContainer}>
          
            <View style={styles.imageRow}>
                <View style={styles.cardContainer1}>
                    <TouchableOpacity onPress={() => navigation.navigate('Attendance')}>
                        <Image
                            source={require('../DashboardPage/Icons/attendence.jpg')}
                            style={styles.image1}
                            resizeMode="cover"
                        />
                        <Text style={styles.imageText}>Attendence</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.cardContainer1}>
                    <TouchableOpacity onPress={() => navigation.navigate('CallDuty')}>
                        <Image
                            source={require('../DashboardPage/Icons/callduty.jpg')}
                            style={styles.image1}
                            resizeMode="cover"
                        />
                        <Text style={styles.imageText}>Call Duty</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.cardContainer1}>
                    <TouchableOpacity onPress={() => navigation.navigate('Reminder')}>
                        <Image
                            source={require('../DashboardPage/Icons/notification-bell.png')}
                            style={styles.image2}
                            resizeMode="cover"
                        />
                        <Text style={styles.imageText}>Reminder Calls</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.cardContainer1}>
                    <TouchableOpacity onPress={() => navigation.navigate('Completedcalls')}>
                        <Image
                            source={require('../DashboardPage/Completedcalls/check.png')}
                            style={styles.image1}
                            resizeMode="cover"
                        />
                        <Text style={styles.imageText}>Completed calls</Text>
                    </TouchableOpacity>
                </View>
            </View>

         
            <View style={styles.imageRow}>
            <View style={styles.cardContainer1}>
                    <TouchableOpacity onPress={() => navigation.navigate('CallReport')}>
                        <Image
                            source={require('../DashboardPage/Icons/report(3).png')}
                            style={styles.image1}
                            resizeMode="cover"
                        />
                        <Text style={styles.imageText}>Call Report</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.cardContainer1}>
                    <TouchableOpacity onPress={() => navigation.navigate('Support')}>
                        <Image
                            source={require('../DashboardPage/Icons/support.jpg')}
                            style={styles.image1}
                            resizeMode="cover"
                        />
                        <Text style={styles.imageText}>Support</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.cardContainer1}>
                    <TouchableOpacity onPress={() => navigation.navigate('AddDonor')}>
                        <Image
                            source={require('../DashboardPage/Icons/adddonor.png')}
                            style={styles.image1}
                            resizeMode="cover"
                        />
                        <Text style={styles.imageText}>Add Donor</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.cardContainer1}>
                    <TouchableOpacity onPress={() => navigation.navigate('MyClient')}>
                        <Image
                            source={require('../DashboardPage/Icons/myclient.jpg')}
                            style={styles.image1}
                            resizeMode="cover"
                        />
                        <Text style={styles.imageText}>My Client</Text>
                    </TouchableOpacity>
                </View>
            </View>

</View>



<View style={styles.idCardContainer}>
{winnerData && Object.keys(winnerData).length > 0 ? (
  <View style={styles.idCard2}>
    <View style={styles.idCardDetails}>
      <Text style={styles.title}>
        🎉Congratulations🎉 Annai Anbalayaa's Today's Task Winner! 🏆👏
      </Text>

      <View style={styles.idCardDetailsRow1}>
      <Image
        source={
          imageError
            ? require('../DashboardPage/Icons/profile.png') 
            : { uri: `https://staff.annaianbalayaa.org/${winnerData.image}` } 
        }
        style={styles.winnerprofileImage}
        resizeMode="cover"
        onError={() => setImageError(true)} 
      />
        <View style={styles.textContainer1}>
          <Text style={styles.idCardName}>Name: {winnerData.name}</Text>
          <Text style={styles.idCardRole}>Count: {winnerData.count}</Text>
          <Text style={styles.idCardBranch}>Branch: {winnerData.branch}</Text>
          <Text style={styles.idCardID}>STAFF ID: {winnerData.to_staff}</Text>
        </View>
      </View>
    </View>
  </View>
) : null}

    <View style={styles.containermessage}>
    {apiData && apiData.length > 0 && (
  <>
    <Text style={styles.chairman}>Chairman's Message:</Text>
    {apiData.map((item) => (
      <View key={item.id.toString()} style={styles.card3}>
        <Text style={[styles.cardContent, { fontWeight: 'bold' }]}>{item.message}</Text>
      </View>
    ))}
  </>
)}

  </View>

    
</View>

<View style={styles.spacer}>
               
            </View>
        </ScrollView>

      
        <View style={styles.bottomNav}>
            <TouchableOpacity
                style={[styles.navButton, isActiveRoute('ANNAI ANBALAYAA TRUST') && styles.activeNavButton]}
                onPress={() => navigation.navigate('ANNAI ANBALAYAA TRUST')}
            >
                <Image source={require('../DashboardPage/Icons/home(1).png')} style={styles.icon} />
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
            style={[styles.profileicon, { borderRadius: 20}]} 
            resizeMode="cover"
            onError={(error) => console.log('Image load error:', error.nativeEvent.error)}
        />
    ) : (
        <Image
            source={require('./Icons/profileimage.png')} 
            style={[styles.icon, { borderRadius: 25,}]} 
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
                <Image source={require('../DashboardPage/Icons/report1.png')} style={styles.icon} />
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
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    textBar1:{
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'space-between',
        paddingHorizontal: 16, 
        height: 60, 
        backgroundColor:"#5a4ccf",
    },
    
    topText:{
        color: "#ffff",
        paddingBottom:6,
        fontSize: 23,
        fontWeight: 'bold',
        textAlign: 'center',
        maxWidth: '82%', 
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 }, 
        textShadowRadius: 2,
    },
    textBar: {
        backgroundColor: '#fff', 
        alignItems: 'center',
        flexDirection: 'row', 
        paddingTop: 5,
    },
    card1: {
        position: "absolute",
        bottom: 10,
        left: 10,
        backgroundColor: "#5a4ccf", 
        padding: 10,
        borderRadius: 5,
    },
    card1Text:{
        textAlign: 'center',  
        fontSize: 10,
        fontWeight: 'bold',
        color: '#fff',
    },
    logo: {
        width: 40,
        height: 40,
        marginBottom:5,
    },
    textBarText: {
    color: "#fa61e9",
    fontSize: 23,
    fontWeight: 'bold',
    maxWidth: '82%', 
    textShadowColor: '#000', 
    textShadowOffset: { width: 1, height: 1 }, 
    textShadowRadius: 2, 
    },
    notificationIcon: {
        width: 37, 
        height: 37, 
        marginLeft: 9, 
        marginBottom: 5, 
    },
    carouselContainer: {
        height: 200,
        marginBottom: 10,
        marginTop: 5,
        backgroundColor: '#fff',
        borderRadius: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
    shadowOpacity: 0.25, 
    shadowRadius: 4, 
    },
    carouselImage: {
        width: screenWidth,
        height: '100%',  
    },
    idCardContainer: {
        alignItems: 'center', 
        marginBottom:30,
        marginTop:20,
    },
    idCard: {
        width: '90%', 
        backgroundColor: '#fff',
        borderRadius: 30, 
        paddingVertical: 1,
        paddingHorizontal: 15, 
        elevation: 9, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 1,
        flexDirection: 'row', 
        alignItems: 'center', 
        
    },
    
    idCardContainer1: {
        alignItems: 'center',
        marginBottom: 10, 
    },
    idCard1: {
        width: '90%', 
        backgroundColor: '#fff', 
        borderRadius: 30  , 
        padding: 10, 
        elevation: 9, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.7,
        shadowRadius: 4,
        flexDirection: 'row',
        alignItems: 'center', 
    },
    idCard2: {
      width: '90%',
      backgroundColor: '#fff',
      borderRadius: 40, 
      padding: 10,
      elevation: 9, 
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      flexDirection: 'row',
      alignItems: 'center', 
  },
  idCardDetailsRow: {
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  idCardDetailsRow1: {
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
    marginTop:10,
    marginBottom:5,
  },
    profileImage: {
    width: 99, 
    height: 125, 
    marginBottom: 10,
    borderRadius: 20,
    marginTop: 10,
    elevation: 7,
        shadowColor: '#000', 
        shadowOffset: { width: 3, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 7, 
      },
      winnerprofileImage: {
        width: 99, 
        height: 115, 
        marginBottom: 10,
        borderRadius: 15,
        padding:20,
        marginLeft:5,
        elevation: 7, 
            shadowColor: '#000',
            shadowOffset: { width: 3, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 7, 
          },
    profileImage1: {
        width: 90, 
        height: 100,
        marginBottom: 10,
        borderRadius: 50,
        marginTop: 10, 
          },
    idCardNote:{
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333', 
        marginBottom: 5,
    },
    idCardImage1:{
        width: 70,
        height: 70,
        borderRadius: 30, 
        marginRight: 15, 
    },
    idCardImage: {
        width: 70, 
        height: 70,
        borderRadius: 30,
        marginRight: 15, 
    },
    idCardDetails: {
        flex: 1, 
    },
    textContainer: {
        flex: 1, 
        padding:20,
      },
      textContainer1: {
        flex: 1, 
        padding:20,
        marginTop:-15,
      },
      idCardName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        
      },
      idCardRole: {
        fontSize: 14,
        marginBottom: 10,
      },
      idCardBranch: {
        fontSize: 14,
        marginBottom: 10,
      },
      idCardID: {
        fontSize: 14,
      },
    idCardNote:{
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333', 
        marginBottom: 5,
    },
    idCardName1: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    idCardRole1: {
        fontSize: 14,
        color: '#555', 
        marginBottom: 5,
    },
    idCardBranch1:{
        fontSize: 12,
        color: '#777',
        marginBottom: 5,
    },
    idCardID1: {
        fontSize: 12,
        color: '#777',
    },
    cardContainer: {
        backgroundColor: '#0884A8',
        borderRadius: 15,
        elevation: 2,
        width:'45%',
        marginHorizontal: 10,

    },
    cardContainer1: {
      backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 2,
        marginBottom: 10,
        padding: 8,
        width: 80,
        height: 83, 
        elevation: 5, 
        shadowColor: '#000', 
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
        borderRadius:60,
    },
    imageRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 10,

    },
    imageRow1: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 20,
        justifyContent: 'space-evenly',
        
    },
    imageRow2: {
        flexDirection: 'row',
        marginLeft: 20,
        width: '100%',
        marginBottom: 20,
    },
    imagemain: {
        width: 40,
        height: 40,
        alignSelf: 'center',
        marginTop: '10%',
    },
    image1: {
        width: 40,
        height: 40,
        alignSelf: 'center',
    },
    image2: {
      width: 37,
      height: 37,
      alignSelf: 'center',
  },
    imageTextmain: {
        textAlign: 'center', 
        marginTop: 5, 
        fontSize: 16,
        marginBottom: '10%',
        color: '#fff',
    },
    imageText: {
        textAlign: 'center', 
        marginTop: 5, 
        fontSize: 10,
        marginBottom: '10%',
        fontWeight: 'bold',
        color: '#000000',
    },
    spacer: {
        height: 100, 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f4f4',
        marginTop: 20,
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
    containermessage: {
        flex: 1,
        padding: 10,
      },
    card: {
      width:'100%',
      backgroundColor: '#fff',
      borderRadius: 10, 
      padding: 10, 
      elevation: 5, 
      shadowColor: '#000', 
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
    card3: {
      width:'100%',
      backgroundColor: '#fff',
      borderRadius: 10, 
      padding: 10,
      elevation: 1, 
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      marginTop:5,
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
});

export default Dashboard;
