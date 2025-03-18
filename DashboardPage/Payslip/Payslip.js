import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator, Button, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import Share from 'react-native-share';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Payslip = () => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [webViewLoaded, setWebViewLoaded] = useState(false);
  const [htmlContent, setHtmlContent] = useState(null);
  const webViewRef = useRef(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
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

  const injectJavaScript = `
    setTimeout(() => {
      window.ReactNativeWebView.postMessage(document.documentElement.outerHTML);
    }, 2000);
  `;

  const handleMessage = (event) => {
    setHtmlContent(event.nativeEvent.data);
    setWebViewLoaded(true);
  };

  const handleSharePDF = async () => {
    if (!webViewLoaded || !htmlContent) {
      Alert.alert('Error', 'Page is still loading. Please wait.');
      return;
    }
  
    try {
      const pdfOptions = {
        html: htmlContent,
        fileName: 'Payslip',
        directory: 'Documents',
        width: 195,  // A4 width in points
        height: 342, // A4 height in points
        base64: false,
      };
  
      const pdf = await RNHTMLtoPDF.convert(pdfOptions);
  
      const shareOptions = {
        title: 'Share Payslip',
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
  
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const url = userId ? `https://staff.annaianbalayaa.org/staff/payslip/${userId}` : '';

  return (
    <View style={styles.container}>
      {userId ? (
        <WebView
          ref={webViewRef}
          source={{ uri: url }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          mixedContentMode="always"
          injectedJavaScript={injectJavaScript}
          onMessage={handleMessage}
          onLoadStart={() => setWebViewLoaded(false)}
          onLoad={() => console.log('WebView loaded successfully')}
          onError={(syntheticEvent) => {
            console.warn('WebView error: ', syntheticEvent.nativeEvent);
          }}
        />
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}

      <View style={styles.buttonContainer}>
        <Button title="Share PDF" onPress={handleSharePDF} disabled={!webViewLoaded} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1},
  buttonContainer: {
    padding:20,
  },
});

export default Payslip;
