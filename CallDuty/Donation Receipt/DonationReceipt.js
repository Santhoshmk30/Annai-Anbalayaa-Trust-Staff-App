import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Button, Alert,TouchableOpacity } from 'react-native';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DonationReceipt = () => {
  const [storedInvoiceNo, setStoredInvoiceNo] = useState(null);
  const viewShotRef = useRef(null);
  const [data, setData] = useState(null); // To store the fetched data

  // Load invoice number from AsyncStorage
  useEffect(() => {
    const loadInvoiceData = async () => {
      try {
        const invoiceNo = await AsyncStorage.getItem('invoice_no');
        if (invoiceNo) {
          setStoredInvoiceNo(invoiceNo);
        } else {
          Alert.alert('Error', 'Invoice number not found');
        }
      } catch (error) {
        console.error('Error loading invoice number:', error);
      }
    };

    loadInvoiceData();
  }, []);

  // Fetch data from API when invoice number is available
  useEffect(() => {
    if (storedInvoiceNo) {
      const fetchData = async () => {
        try {
          const response = await fetch('https://staff.annaianbalayaa.org/public/api/invoice', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: storedInvoiceNo, // Pass the invoice number
            }),
          });

          const data = await response.json();
          if (response.ok) {
            setData(data);
            console.log(data);
          } else {
            console.error('API error:', result.message || 'Unknown error');
            Alert.alert('Error', result.message || 'Failed to fetch invoice data');
          }
        } catch (error) {
          console.error('Error fetching API data:', error);
          Alert.alert('Error', 'Failed to fetch invoice data');
        }
      };

      fetchData();
    }
  }, [storedInvoiceNo]);
  
  const handleSharePDF = async () => {
  try {
    // Capture the content as an image
    const uri = await viewShotRef.current.capture();
    const filePath = `${RNFS.DocumentDirectoryPath}/DonationReceipt.jpg`;
    await RNFS.moveFile(uri, filePath);

    // Define A4 dimensions in points (1 point = 1/72 inch)
    const htmlContent = `
      <html>
      <head>
        <style>
          body {
            width: 595px; /* A4 width */
            height: 842px; /* A4 height */
            margin:80;
            marginTop:80;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          img {
            width: 90%; /* Adjust image size */
            max-width: 550px; /* Ensure it fits within A4 width */
          }
        </style>
      </head>
      <body>
        <img src="file://${filePath}"style="width:100%; max-width:962px;" />
      </body>
      </html>
    `;

    // PDF generation options with A4 size
    const pdfOptions = {
      html: htmlContent,
      fileName: 'DonationReceipt',
      directory: 'Documents',
      height: 842, // A4 height in points
      width: 595,  // A4 width in points
    };

    const pdf = await RNHTMLtoPDF.convert(pdfOptions);

    // Share the generated PDF
    const shareOptions = {
      title: 'Share Donation Receipt',
      url: `file://${pdf.filePath}`,
      type: 'application/pdf',
    };

    await Share.open(shareOptions);
    Alert.alert('Success', 'PDF has been shared successfully!');
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Failed to share the PDF.');
  }
};

  
  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  };


  return (
    <ScrollView horizontal>
    <ScrollView style={styles.scrollContainer}>
  <View style={styles.a4Container}>
    <ViewShot
      ref={viewShotRef}
      style={styles.a4Container} // Ensure A4 size
      options={{ format: 'jpg', quality: 0.9 }}
    >
      <View style={styles.headerContainer}>
  <Image source={require('../trust-logo.png')} style={styles.logo} />
  <View style={styles.textContainer}>
    <Text style={styles.title}>Annai Anbalayaa Trust</Text>
    <Text style={styles.subTitle}>
      GOVT. REG NO: 1228/2006 | PAN NO: AACTA2634E | NITI Aayog Reg no: TN/2017/0160286
    </Text>
  </View>
</View>
      <Text style={styles.header}>DONATION RECEIPT</Text>

      <View style={styles.detailsContainer}>
        {data ? (
          <>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Receipt No:</Text>
              <Text style={styles.detailValue}>{data.invoice_no || '-'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Receipt Date:</Text>
              <Text style={styles.detailValue}>{formatDateTime(data.paid_on|| '-')}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Donor Name:</Text>
              <Text style={styles.detailValue}>{data.name || '-'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Email:</Text>
              <Text style={styles.detailValue}>{data.email || '-'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mobile No:</Text>
              <Text style={styles.detailValue}>{data.mobile_no || '-'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount:</Text>
              <Text style={styles.detailValue}>Rs.{data.amount || '-'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Address:</Text>
              <Text style={styles.detailValue}>{data.address || '-'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>PAN NO:</Text>
              <Text style={styles.detailValue}>{data.pan_no || '-'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Mode:</Text>
              <Text style={styles.detailValue}>{data.payment_mode || '-'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transaction ID:</Text>
              <Text style={styles.detailValue}>{data.transaction_no || '-'}</Text>
            </View>
          </>
        ) : (
          <Text style={styles.noDataText}>Loading data...</Text>
        )}
      </View>

      <Text style={styles.message}>
        "Thank you very much for supporting Annai Anbalayaa Trust to give a better life to the destitute and elders who are greatly in need."
      </Text>
      <Text style={styles.note}>
        Note: You have donated to an organization which offers tax-exemption U/S 10B of Income Tax Act 1961.
        "Your contribution will help ensure that our senior mothers receive the care and respect they truly deserve."
      </Text>
      <Text style={styles.signature}>Annai Anbalayaa Trust</Text>
      <Image source={require('../anbalayaa-seel.png')} style={styles.seal} />
      <Text style={styles.signature}>Authorized Signatory</Text>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Head Office: No/67 Sri Saibaba Nagar, NCTPS Post, Athipattu, Chennai - 600120.Mobile No: +91 99418 40841.E-Mail: info@annaianbalayaa.org
        </Text>
        <Text style={styles.footerText}>
          Branch Office: 311, TT Krishnamachari Rd, Pudupet, Royapettah, Chennai, Tamil Nadu 600014.Mobile No: +91 99418 40841.Website: www.annaianbalayaa.org
        </Text>
      </View>
    </ViewShot>
  </View>

  <View style={styles.buttonContainer}>
  <TouchableOpacity style={styles.button} onPress={handleSharePDF}>
    <Text style={styles.buttonText}> Share PDF </Text>
    </TouchableOpacity> 
  </View>
</ScrollView>
</ScrollView>

  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  a4Container: {
    width: 435, 
    height: 642, 
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row', // Align items in a row
    alignItems: 'center', // Align vertically
    justifyContent: 'center', // Center content horizontally
    
  },
  logo: {
    width: 80, // Adjust logo width
    height: 80, // Adjust logo height
    resizeMode: 'contain',
    marginRight: 10, // Add spacing between logo and text
  },
  textContainer: {
    flex: 1, // Take remaining space
    alignItems: 'flex-start', // Align text to left
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 14,
    flexWrap: 'wrap', // Ensure text wraps correctly
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  detailsContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 14,
  },
  message: {
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 3,
  },
  note: {
    fontSize: 10,
    textAlign: 'center',
    marginVertical: 1,
  },
  signature: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 1,
  },
  seal: {
    width: 80,
    height: 60,
    resizeMode: 'contain',
  },
  footer: {
    marginTop: 3,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    marginVertical: 30,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  
  button: {
    width: 400, 
    height: 50, 
    backgroundColor: '#4F46E5', // Example background color
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, // Optional: for rounded corners
    paddingHorizontal: 20, // Optional: for additional horizontal padding
  },
  
  buttonText: {
    fontSize: 16, // Larger font size for the button text
    color: '#fff', // Text color
    fontWeight: 'bold', // Make text bold for visibility
  },
});

export default DonationReceipt;
