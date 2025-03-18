import React from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';


const CallReportDetails = ({ route }) => {
  const { date, complete, newtask, pending, reminder } = route.params;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid Date';
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  };
  return (
    <View style={styles.container}>
 <Text style={styles.title}>Call Report Details for {formatDate(date || "N/A")}</Text>
<View style={styles.detailsContainer}>
        <View style={styles.detailBox}>
          <Image source={require('../TeamReport/customer-service.png')} style={styles.largeIcon} />
          <Text style={styles.detailText}>{newtask}</Text>
          <Text style={styles.detailSubText}>Total Task</Text>
        </View>
        <View style={styles.detailBox}>
          <Image source={require('../TeamReport/cross.png')} style={styles.largeIcon} />
          <Text style={styles.detailText}>{reminder}</Text>
          <Text style={styles.detailSubTextpending}>Pending</Text>
        </View>
        </View>
     <View style={styles.detailsContainer}>
        <View style={styles.detailBox}>
          <Image source={require('../TeamReport/cross.png')} style={styles.largeIcon} />
          <Text style={styles.detailText}>{reminder}</Text>
          <Text style={styles.detailSubTextreminder}>Reminder</Text>
        </View>
        <View style={styles.detailBox}>
          <Image source={require('../TeamReport/check-mark.png')} style={styles.largeIcon} />
          <Text style={styles.detailText}>{complete}</Text>
          <Text style={styles.detailSubTextcomplete}>Complete</Text>
        </View>
        </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  card: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    elevation: 3,
    width: '100%',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
  },
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
  },
  detailText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  detailSubText: { fontSize: 14, color: '#363A57', textAlign: 'center', fontWeight: 'bold' },
  detailSubTextcomplete: { fontSize: 14, color: '#008000', textAlign: 'center', fontWeight: 'bold' },
  detailSubTextpending: { fontSize: 14, color: '#ff0000', textAlign: 'center', fontWeight: 'bold' },
  detailSubTextreminder: { fontSize: 14, color: '#4F46E5', textAlign: 'center', fontWeight: 'bold' },
  largeIcon: { width: 30, height: 30 },
});

export default CallReportDetails;
