import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View, PermissionsAndroid, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';


// Import Screens
import ScanPage from './ScanPage/ScanPage';
import RegisterPage from './RegisterPage/RegisterPage';
import VerifyOtpPage from './VerifyOtp/VerifyOtp';
import Dashboard from './DashboardPage/DashboardPage';
import CallDuty from './CallDuty/CallDuty';
import CallActivity from './CallDuty/CallActivity/CallActivity';
import CallActivityHistory from './CallDuty/CallActivity/CallActivityHistory';
import WhatsAppPage from './CallDuty/CallActivity/WhatsappPage';
import Attendance from './Attendance/Attendance';
import AttendanceDetails from './Attendance/AttendanceDetails';
import Profile from './DashboardPage/Profile/Profile';
import MyClient from './DashboardPage/MyClient/MyClient';
import AddDonor from './DashboardPage/AddDonor/AddDonor';
import Support from './DashboardPage/Support/Support';
import Payslip from './DashboardPage/Payslip/Payslip';
import CallReport from './DashboardPage/CallReport/CallReport';
import ApplyLeave from './DashboardPage/ApplyLeave/ApplyLeave';
import UploadExcel from './DashboardPage/UploadExcel/UploadExcel';
import AssignWork from './DashboardPage/AssignWork/AssignWork';
import TeamReport from './DashboardPage/TeamReport/TeamReport';
import SigninPage from './SigninPage/SigninPage';
import Otp from './VerifyOtp/Otp';
import Reminder from './DashboardPage/Reminder/Reminder';
import DonationReceipt from './CallDuty/Donation Receipt/DonationReceipt';


const Stack = createStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null); // Dynamically determine the initial route
  const [isLoading, setIsLoading] = useState(true); // For loading spinner
  const [fcmToken, setFcmToken] = useState(null);

  // AsyncStorage Initialization
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Fetch login/logout status from AsyncStorage
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
        const isLoggedOut = await AsyncStorage.getItem('isLoggedOut');

        if (isLoggedIn === 'true') {
          setInitialRoute('ANNAI ANBALAYAA TRUST'); // Navigate to Dashboard
        } 
        else if (isLoggedOut === 'true') {
          setInitialRoute('SigninPage'); // Navigate to Signin
        } else {
          setInitialRoute('RegisterPage'); // Default route for new users
        }
        await requestUserPermission();
        await requestNotificationPermission();
      } catch (error) {
        console.error('Error initializing AsyncStorage:', error);
        setInitialRoute('RegisterPage'); // Fallback in case of error
      } finally {
        setIsLoading(false); // Stop loading spinner
      }
    };

    initializeApp();
    const requestNotificationPermission = async () => {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notification Permission',
            message: 'This app needs permission to send you notifications',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
  
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission granted');
        } else {
          console.log('Notification permission denied');
        }
      }
    };


const requestUserPermission = async () => {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getToken();
  }
};

}, []);
const getToken = async () => {
  try {
    const token = await messaging().getToken();
    setFcmToken(token);
    console.log("FCM Token:", token);
  } catch (error) {
    console.error("Error fetching FCM token:", error);
  }
};

useEffect(() => {
  const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
    console.log("Foreground message received:", remoteMessage);
    Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
  });

  return unsubscribeForeground;
}, []);

useEffect(() => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Background message received:', remoteMessage);
  });
}, []);


 
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute} 
        screenOptions={{
          headerStyle: { backgroundColor: '#4F46E5' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
        }}
      >
        {/* Define Stack Screens */}
        <Stack.Screen name="ScanPage" component={ScanPage} options={{ title: 'Scan Page' }} />
        <Stack.Screen
          name="RegisterPage"
          component={RegisterPage}
          options={{ title: 'Register', headerLeft: () => null }}
        />
        <Stack.Screen name="VerifyOtpPage" component={VerifyOtpPage} options={{ title: 'Verify OTP' }} />
        <Stack.Screen
          name="ANNAI ANBALAYAA TRUST"
          component={Dashboard}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="CallDuty" component={CallDuty} options={{ title: 'Call Duty' }} />
        <Stack.Screen name="CallActivity" component={CallActivity} options={{ title: 'Call Activity' }} />
        <Stack.Screen name="WhatsAppPage" component={WhatsAppPage} options={{ title: 'WhatsApp' }} />
        <Stack.Screen name="Attendance" component={Attendance} options={{ title: 'Attendance' }} />
        <Stack.Screen name="AttendanceDetails" component={AttendanceDetails} options={{ title: 'Attendance Details' }} />
        <Stack.Screen name="Profile" component={Profile} options={{ title: 'Profile' }} />
        <Stack.Screen name="MyClient" component={MyClient} options={{ title: 'My Client' }} />
        <Stack.Screen name="AddDonor" component={AddDonor} options={{ title: 'Add Donor' }} />
        <Stack.Screen name="Support" component={Support} options={{ title: 'Support' }} />
        <Stack.Screen name="Payslip" component={Payslip} options={{ title: 'Payslip' }} />
        <Stack.Screen name="CallReport" component={CallReport} options={{ title: 'Call Report' }} />
        <Stack.Screen name="ApplyLeave" component={ApplyLeave} options={{ title: 'Apply Leave' }} />
        <Stack.Screen name="UploadExcel" component={UploadExcel} options={{ title: 'Upload Excel' }} />
        <Stack.Screen name="AssignWork" component={AssignWork} options={{ title: 'Assign Work' }} />
        <Stack.Screen name="TeamReport" component={TeamReport} options={{ title: 'Report' }} />
        <Stack.Screen name="SigninPage" component={SigninPage} options={{ title: 'Sign In' }} />
        <Stack.Screen name="Otp" component={Otp} options={{ title: 'Verify OTP' }} />
        <Stack.Screen name="Reminder" component={Reminder} options={{ title: 'Reminder' }} />
        <Stack.Screen name="DonationReceipt" component={DonationReceipt} options={{ title: 'Donation Receipt' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
