import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const AssignWork = () => {
  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri: 'https://staff.annaianbalayaa.org/staff/myaccount' }} 
        style={styles.webview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
});

export default AssignWork;
